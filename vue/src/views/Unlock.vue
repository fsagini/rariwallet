<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container">
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
    <spinner v-model="showSpinner" v-bind:status="status"></spinner>
    <h2 class="text-white text-lg font-bold">UNLOCK WALLET</h2>
    <div class="field">
      <div class="control">
        <input
          type="password"
          ref="unlock_password"
          class="input"
          name="walletPassword"
          v-model="walletPassword"
          @keypress="handleKeyPress"
          :placeholder="$t('common.PASSWORD')"
        />
        <div v-if="showRecovery">
          <p class="help is-danger">
            {{ $t("auth.CANNOT_DECRYPT_PASSWORD") }}
            <router-link to="/recovery">{{ $t("auth.RESTORE_ACCOUNT") }}</router-link>
          </p>
        </div>
      </div>
    </div>

    <div class="error" v-if="logonError">
      <p>⚠️ <span v-html="logonError"></span></p>
    </div>

    <button @click="login()" class="unlock__button shadow-md" :disabled="!walletPassword">
      <span class="text">{{ $t("auth.LOGIN") }}</span>
    </button>
    <div class="py-2 flex items-center space-x-4">
      <span class="divider" />
      <span>OR</span>
      <span class="divider" />
    </div>
    <div @click="logout()">
      <button class="unlock__button shadow-md">
        {{ $t("auth.SWITCH_ACCOUNT") }}
      </button>
    </div>
    <p class="forgot-password">
      {{ $t("auth.FORGOT_PASSWORD") }}
      <router-link to="/recovery" class="login-router transition-faster"
        ><span class="text-white">{{ $t("auth.RECOVER_YOUR_WALLET") }}</span></router-link
      >
    </p>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Global } from "../mixins/mixins";
import { sha256 } from "../utils/cryptoFunctions";
import jazzicon from "@metamask/jazzicon";
import { getDictionaryValue } from "../utils/dictionary";
import { Recaptcha } from "../mixins/recaptcha";

@Component({})
export default class Unlock extends mixins(Global, Recaptcha) {
  // Component properties
  walletPassword = "";
  walletEmail = this.$store.getters.walletEmail;
  walletPhoneNumber = this.$store.getters.walletPhoneNumber;
  iconSeed = this.$store.getters.iconSeed;
  showRecovery = false;
  logonError = "";

  /**
   * Cmponent mounted lifestyle hook
   */
  async mounted() {
    // set focus to the password field when the control opens
    window.setTimeout(() => {
      const passwordEmelemt: any = this.$refs.unlock_password;
      if (passwordEmelemt) passwordEmelemt.focus();
    }, 100);

    const iconSeed = localStorage.getItem("iconSeed") || "";
    this.generateImage(iconSeed);

    if (!this.$store.state.encryptedSeed || !this.$store.state.encryptedSeed.ciphertext) {
      await this.loadEncryptedSeed();
    }

    if (!this.$store.state.hashedPassword) {
      await this.loadPassword();
    }

    if (
      this.$store.state.hashedPassword &&
      this.$store.state.encryptedSeed.ciphertext !== undefined
    ) {
      this.showSpinner(this.$t("loader.LOADING_ACCOUNT").toString());

      // Check if the wallet can be unlocked using the local-storage stored password
      this.unlockWithStoredPassword(this.recaptchaToken)
        .then((result) => {
          this.hideSpinner();
          if (result) {
            this.$router.push("/").catch(() => undefined);
          }
        })
        .catch((error) => {
          this.hideSpinner();

          if (error && error.toString() === "TypeError: Failed to fetch") {
            this.showNetworkError(true);
          }
          // error
        });
    } else {
      this.unlockUpdate();
    }
  }

  /**
   * Execute the logon
   */
  async login() {
    // block if unlock is already executing
    if (this.store.loading) {
      return;
    }
    this.logonError = "";
    const password = await sha256(this.walletPassword);
    this.showSpinnerThenAutohide(this.$t("loader.RECOVERY_LOG_IN").toString());
    const recaptchaToken = this.recaptchaToken;

    if (this.$store.state.encryptedSeed && this.$store.state.encryptedSeed.ciphertext) {
      // Call the fetchUser store action to process the wallet logon
      this.unlockWithPassword({ password, recaptchaToken })
        .then(() => {
          // open root page after logon success
          this.$router.push("/").catch(() => undefined);
        })
        .catch((error) => {
          this.hideSpinner();
          if (error.error === "RECAPTCHA_REQUIRED") {
            this.executeRecaptcha(this.login);
            return;
          }

          if (error && error.toString() === "TypeError: Failed to fetch") {
            this.showNetworkError(true);
          } else {
            this.logSentryError("Unlock", error.toString(), {});
          }

          // Logon failed
          this.logonError = getDictionaryValue("DECRYPT_FAILED");
        });
    } else {
      this.loginEmail();
    }
  }

  loginEmail() {
    this.logonError = "";
    this.showSpinner(this.$t("loader.LOADING_ACCOUNT").toString());
    this.store.loginComplete = false;
    const email = this.walletEmail;
    const phonenumber = this.walletPhoneNumber;
    const password = this.walletPassword;
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
            this.logonError = getDictionaryValue(error.error);
          } else {
            // console.log('Error in login', error);
          }
        }
      });
  }

  logout() {
    localStorage.removeItem("lastEmail");
    this.logoutWallet();

    //this.$router.push('/login').catch(() => undefined);;
  }

  generateImage(seed: any): void {
    if (!seed) {
      return;
    }

    const ref: any = this.$refs.userImage;
    if (!ref) {
      if (seed) {
        setTimeout(() => {
          this.generateImage(seed);
        }, 100);
      }
      return;
    }
    ref.innerHTML = "";

    const image = jazzicon(32, seed);
    ref.append(image);
  }

  handleKeyPress(e: any) {
    const key = e.which || e.charCode || e.keyCode || 0;

    if (key === 13) {
      this.login();
    }
  }
}
</script>

<style scoped>
.unlock__button {
  padding: 15px 100px;
  background: #000;
  color: #fff;
  border-radius: 24px;
  font-weight: bold;
}
</style>
