<template>
  <div class="sign__up">
    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="recaptchaSiteKey"
      :load-recaptcha-script="true"
      @verify="onCaptchaVerified"
      @error="onCaptchaError"
      @expired="onCaptchaExpired"
      @render="onCaptchaLoaded"
      style="display: none"
    />
    <div>
      <h2 data-cy="signUpTitle" class="title">{{ $t("auth.SIGNUP") }}</h2>
      <div class="signup_image">
        <img src="../assets/img/auth/signupbanner-removebg-preview.png" alt="" />
      </div>
    </div>
    <div class="container figma">
      <form v-on:submit.prevent="signupExecute" novalidate>
        <div>
          <div class="field title__mt">
            <div class="textbox">
              <input
                class="pl-2"
                type="email"
                name="walletEmail"
                data-cy="walletEmail"
                :placeholder="$t('common.EMAIL')"
                v-model="walletEmail"
              />
            </div>
          </div>
          <div class="field">
            <div class="textbox">
              <input
                class="pl-2"
                type="text"
                name="phoneNumber"
                data-cy="phoneNumber"
                :placeholder="$t('common.PHONE')"
                v-model="phoneNumber"
              />
            </div>
          </div>
          <div class="field">
            <div class="textbox">
              <div @click="viewPassword">
                <span v-if="showPassword !== true">
                  <img
                    class="fa-eye"
                    src="../assets/img/eye-svgrepo-com.svg"
                    alt="eye-slash"
                  />
                </span>
                <span v-else>
                  <img
                    class="fa-eye-slash"
                    src="../assets/img/eye-slash-svgrepo-com.svg"
                    alt="eye-slash"
                  />
                </span>
              </div>
              <input
                :type="showPassword ? 'text' : 'password'"
                name="walletPassword"
                data-cy="walletPassword"
                v-model="walletPassword"
                class="pl-2"
                :placeholder="$t('common.PASSWORD')"
              />
              <password
                v-model="walletPassword"
                :strength-meter-only="true"
                :secure-length="8"
                style="max-width: initial"
              />
              <div class="password-help">
                <p>{{ $t("password.REQUIREMENTS") }}</p>
                <ul class="items">
                  <li
                    :class="{
                      done: passwordChecks.min === 'pass',
                      fail: passwordChecks.min === 'fail',
                    }"
                  >
                    {{ $t("password.MIN_CHARACTERS") }}
                  </li>
                  <li
                    :class="{
                      done: passwordChecks.lowercase === 'pass',
                      fail: passwordChecks.lowercase === 'fail',
                    }"
                  >
                    {{ $t("password.LOWERCASE_LETTER") }}
                  </li>
                  <li
                    :class="{
                      done: passwordChecks.uppercase === 'pass',
                      fail: passwordChecks.uppercase === 'fail',
                    }"
                  >
                    {{ $t("password.UPPERCASE_LETTER") }}
                  </li>
                  <li
                    :class="{
                      done: passwordChecks.number === 'pass',
                      fail: passwordChecks.number === 'fail',
                    }"
                  >
                    {{ $t("password.NUMBER") }}
                  </li>
                  <li
                    :class="{
                      done: passwordChecks.match === 'pass',
                      fail: passwordChecks.match === 'fail',
                    }"
                  >
                    {{ $t("password.PASSWORD_MATCH") }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="textbox">
              <input
                :placeholder="$t('common.CONFIRM_PASSWORD')"
                :type="seePassword ? 'text' : 'password'"
                name="walletPasswordRepeat"
                class="pl-2"
                data-cy="walletPasswordRepeat"
                v-model="walletPasswordRepeat"
              />
            </div>
          </div>
          <div class="error" v-if="logonError">
            <p>⚠️ <span v-html="logonError"></span></p>
          </div>

          <button type="submit" data-cy="createNewWallet" class="signin__button">
            <span class="text">{{ $t("auth.CREATE_WALLET") }}</span>
          </button>

          <div class="divider"></div>

          <div class="login-link">
            <span>{{ $t("auth.ALREADY_HAVE_WALLET") }}</span>
            <router-link to="/login" class="login-router transition-faster">
              <span data-cy="logInButton">
                {{ $t("auth.ALREADY_HAVE_ACCOUNT") }}
              </span>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Password from "vue-password-strength-meter";
import { validateInput } from "../utils/backupRestore";

import Component, { mixins } from "vue-class-component";
import { Global } from "../mixins/mixins";
import { Recaptcha } from "../mixins/recaptcha";

import { Watch } from "vue-property-decorator";
import { getDictionaryValue } from "../utils/dictionary";

@Component({
  components: {
    Password,
  },
})
export default class Signup extends mixins(Global, Recaptcha) {
  // properties
  walletEmail = "";
  walletPassword = "";
  phoneNumber = "";
  walletPasswordRepeat = "";
  signup = false;
  logonError = "";
  showPassword = false;
  passwordChecks: any = {
    min: "",
    uppercase: "",
    lowercase: "",
    number: "",
    match: "",
  };
  @Watch("walletPassword")
  handlePasswordChange(newValue: string) {
    this.passwordChecks = this.checkPassword(
      newValue,
      false,
      this.passwordChecks,
      this.walletPasswordRepeat
    );
  }

  @Watch("walletPasswordRepeat")
  handlePasswordRepeatChange(newValue: string) {
    this.passwordChecks = this.checkPassword(
      this.walletPassword,
      false,
      this.passwordChecks,
      newValue,
      true
    );
  }

  // Methods
  viewPassword() {
    this.showPassword = !this.showPassword;
  }
  async signupExecute(e: any) {
    // block if signup is already executing
    if (this.store.loading) {
      return;
    }
    if (e) e.preventDefault();
    this.logonError = "";

    this.passwordChecks = this.checkPassword(
      this.walletPassword,
      true,
      this.passwordChecks,
      this.walletPasswordRepeat
    );

    if (
      Object.keys(this.passwordChecks).some(
        (value: string) => this.passwordChecks[value] !== "pass"
      )
    ) {
      return;
    }

    /**
     * Validating Email
     */
    const emailMessage = await validateInput("email", this.walletEmail);
    if (emailMessage) {
      this.hideSpinner();
      this.logonError = emailMessage;
      return;
    }

    /**
     * Validating Password
     */
    const passwordMessage = await validateInput("password", this.walletPassword);
    if (passwordMessage) {
      this.hideSpinner();
      this.logonError = passwordMessage;
      return;
    }

    const email = this.walletEmail;
    const phonenumber = this.phoneNumber;
    const recaptchaToken = this.recaptchaToken;
    this.showSpinner("Creating Wallet...");
    this.createWallet({
      email,
      phonenumber,
      password: this.walletPassword,
      recaptchaToken,
    })
      .then(() => {
        this.hideSpinner();
        if (
          this.store.twoFaRequired.email ||
          this.store.twoFaRequired.authenticator ||
          this.store.twoFaRequired.needConfirmation
        ) {
          // open 2fa page if 2fa is required
          this.$router.push("/2fa").catch(() => undefined);
        } else {
          this.$router.push("/").catch(() => undefined);
        }
      })
      .catch((error) => {
        this.hideSpinner();
        if (error.error === "RECAPTCHA_REQUIRED") {
          this.executeRecaptcha(this.signupExecute);
          return;
        }

        if (error && error.toString() === "TypeError: Failed to fetch") {
          this.showNetworkError(true);
        } else {
          this.logSentryError("createWallet", error.toString(), {});
        }

        this.logonError = getDictionaryValue(error.toString());
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signup_image img {
  outline: none;
  background: none;
}
.title__mt {
  padding-top: 25px;
}
.figma {
  background: #fff;
  border-radius: 14px 14px 0 0;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
.password {
  background: none;
  outline: none;
  border: none;
}
.create_account {
  background: #99d7f1;
  border: none;
  color: #fff;
  font-size: 25px;
  padding: 15px 80px;
  cursor: pointer;
  font-weight: 700;
  border-radius: 10px;
}
.textbox {
  border-bottom: 3px solid #a3bdfe;
  width: 100%;
  overflow: hidden;
  font-size: 20px;
  padding: 8px 0;
}
.confirm__password .fa-eye {
  cursor: pointer;
  margin-left: 250px;
  position: absolute;
  top: 355px;
}
.confirm__password .fa-eye-slash {
  cursor: pointer;
  margin-left: 250px;
  position: absolute;
  top: 355px;
}
.fa-eye {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-left: 290px;
  position: absolute;
  top: 200px;
}
.fa-eye-slash {
  width: 30px;
  height: 30px;
  margin-left: 290px;
  position: absolute;
  top: 200px;
  cursor: pointer;
}
.textbox input {
  border: none;
  outline: none;
  background: none;
  overflow: hidden;
}
.signin__button {
  padding: 15px 80px;
  border-radius: 24px;
  color: #fff;
  border: none;
  background: #347af0;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #347af0;
}

@media (max-width: 480px) {
  .fa-eye {
    margin-left: 250px;
  }
  .fa-eye-slash {
    margin-left: 250px;
  }
}
</style>
