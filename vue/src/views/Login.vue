<template>
  <div>
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
    <div class="auth__banner">
      <h2 data-cy="logInTitle" class="title">{{ $t("auth.LOGIN__HEADER") }}</h2>
      <img src="../assets/img/auth/login.svg" alt="" />
    </div>
    <div class="container figma">
      <form v-on:submit.prevent="login">
        <div class="field title__mt">
          <div class="textbox">
            <input
              type="email"
              :placeholder="$t('common.EMAIL')"
              data-cy="walletEmail"
              name="walletEmail"
              v-model="walletEmail"
              autocomplete="off"
              class="pl-2"
            />
          </div>
        </div>
        <div class="field">
          <div class="textbox">
            <div @click="viewPassword()">
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
              :placeholder="$t('common.PASSWORD')"
              data-cy="walletPassword"
              name="walletPassword"
              v-model="walletPassword"
              autocomplete="off"
              class="pl-2"
            />
          </div>
        </div>
        <div class="error" v-if="logonError">
          <p data-cy="loginError">
            ⚠️ <span v-html="logonError"></span>
            <router-link
              v-if="showRecovery"
              to="/recovery"
              class="login-router transition-faster"
              ><span class="ml-1">{{
                $t("auth.RECOVER_YOUR_WALLET_QUESTION")
              }}</span></router-link
            >
          </p>
        </div>

        <button type="submit" data-cy="submit" class="signin__button">
          <span class="text">{{ $t("auth.LOGIN") }}</span>
        </button>

        <p class="forgot-password">
          {{ $t("auth.FORGOT_PASSWORD") }}
          <router-link to="/recovery" class="login-router transition-faster"
            ><span>{{ $t("auth.RECOVER_YOUR_WALLET") }}</span></router-link
          >
        </p>

        <div class="divider"></div>

        <div class="login-link">
          <span>{{ $t("auth.DO_NOT_HAVE_WALLET") }}</span>
          <router-link to="/signup" class="login-router transition-faster">
            <span data-cy="signUpButton">
              {{ $t("auth.SIGNUP") }}
            </span>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Global } from "../mixins/mixins";
import Password from "vue-password-strength-meter";
import { getDictionaryValue } from "../utils/dictionary";
import { Recaptcha } from "../mixins/recaptcha";

@Component({
  components: {
    Password,
  },
})
export default class Login extends mixins(Global, Recaptcha) {
  // Component properties
  walletEmail = "";
  walletPassword = "";
  showRecovery = false;
  logonError = "";
  phonenumber = "";
  showPassword = false;

  viewPassword() {
    this.showPassword = !this.showPassword;
  }
  unlock() {
    this.unlockWithStoredPassword(this.recaptchaToken)
      .then((result) => {
        if (result) {
          this.$router.push("/").catch(() => undefined);
        }
      })
      .catch((error) => {
        if (error.error === "RECAPTCHA_REQUIRED") {
          this.executeRecaptcha(this.unlock);
          return;
        }
        if (error !== true && error !== false) {
          // console.log('Error in unlock', error);
        }
      });
  }

  /**
   * Cmponent mounted lifestyle hook
   */
  mounted() {
    if (this.store.email) {
      this.walletEmail = this.store.email;
    }
    if (!this.walletEmail) {
      const email = localStorage.getItem("lastEmail");
      if (email) this.walletEmail = email;
      const phoneNumber = localStorage.getItem("lastphonenumber");
      if (phoneNumber) this.phonenumber = phoneNumber;
    }

    if (this.store.status !== "invalid password" && this.store.email) {
      // Check if the wallet can be unlocked using the local-storage stored password
      this.unlock();
    } else {
      this.unlockUpdate();
    }

    if (this.store.status === "invalid password") {
      this.logonError = getDictionaryValue("DECRYPT_FAILED");
      if (this.walletEmail) this.loginErrorReturn(this.walletEmail, "INVALID_PASSWORD");
      this.showRecovery = true;
    }
  }

  async loginErrorReturn(email: string, err: any) {
    if (this.isIframe()) {
      if (this.store.connection && this.store.connection !== null) {
        const promise = this.store.connection.promise;

        (await promise).onLoginError(email, err);
      }
    }
  }

  /**
   * Execute the logon
   *
   */

  login() {
    // block if login is already executing
    if (this.store.loading) {
      return;
    }
    this.logonError = "";
    this.showSpinner(this.$t("loader.LOADING_ACCOUNT").toString());
    this.store.loginComplete = false;
    const email = this.walletEmail;
    const password = this.walletPassword;
    const phonenumber = this.phonenumber;
    const recaptchaToken = this.recaptchaToken;

    // Call the fetchUser store action to process the wallet logon
    this.fetchUser({ email, phonenumber, password, recaptchaToken })
      .then(() => {
        if (
          this.store.twoFaRequired.email ||
          this.store.twoFaRequired.authenticator ||
          this.store.twoFaRequired.needConfirmation
        ) {
          this.hideSpinner();
          // open 2fa page if 2fa is required
          this.$router.push("/2fa").catch(() => undefined);
        } else {
          this.unlockWithStoredPassword(this.recaptchaToken)
            .then(() => {
              this.hideSpinner();

              // open root page after logon success
              this.$router.push("/").catch(() => undefined);
            })
            .catch((error) => {
              this.hideSpinner();
              if (error.error === "RECAPTCHA_REQUIRED") {
                this.executeRecaptcha(this.login);
                return;
              }
              this.logonError = getDictionaryValue("DECRYPT_FAILED");
              this.loginErrorReturn(email, "INVALID_PASSWORD");
              this.showRecovery = true;
            });
        }
      })
      .catch((error) => {
        this.hideSpinner();

        if (error.error === "RECAPTCHA_REQUIRED") {
          this.executeRecaptcha(this.login);
          return;
        }
        // Logon failed

        if (error && error.toString() === "TypeError: Failed to fetch") {
          this.showNetworkError(true);
        } else {
          if (!error.error) {
            this.logSentryError("fetchUser", error.toString(), { email });
          }
        }

        if (error !== true && error !== false) {
          if (error.success === false) {
            this.loginErrorReturn(email, error.error);
            this.logonError = getDictionaryValue(error.error);
          } else {
            this.loginErrorReturn(email, error);
            // console.log('Error in login', error);
          }
        }
      });
  }
}
</script>

<style scoped>
.textbox {
  border-bottom: 3px solid #a3bdfe;
  width: 100%;
  overflow: hidden;
  font-size: 20px;
  padding: 8px 0;
}

.textbox input {
  border: none;
  outline: none;
  background: none;
  overflow: hidden;
}
.signin__button {
  padding: 10px 100px;
  border-radius: 24px;
  color: #fff;
  border: none;
  background: #347af0;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
}
.figma {
  background: #fff;
  border-radius: 14px 14px 0 0;
}
.fa-eye {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-left: 270px;
  position: absolute;
  top: 120px;
}
.fa-eye-slash {
  margin-left: 270px;
  position: absolute;
  top: 120px;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

.title__mt {
  padding-top: 25px;
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
