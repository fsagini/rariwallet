<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div v-if="currentPage === 0">
      <div v-if="store.email">
        <img
          src="@/assets/img/gmail_recovery.png"
          :alt="$t('images.RECOVER_WALLET')"
          class="mb-3"
        />
        <div class="white__container">
          <div class="container">
            <div class="py-4">
              <h2 class="title">{{ $t("recovery.RECOVERY_TITLE") }}</h2>
              <p class="subtitle">{{ $t("recovery.RECOVERY_DESCRIPTION") }}</p>
            </div>

            <div class="error alert warning is-size-7" v-if="logonError">
              <p data-cy="loginError">⚠️ <span v-html="logonError">&nbsp;</span></p>
              <a
                v-if="showMore"
                href="https://support.morpher.com/en/article/recovering-your-wallet-forgot-password-snvhxu/"
                target="__blank"
                class="login-router transition-faster"
                ><span>{{ $t("common.LEARN_MORE") }}</span></a
              >
            </div>

            <div class="field is-grouped">
              <RecoverWalletGoogle @setPassword="setPassword"></RecoverWalletGoogle>
            </div>

            <router-link to="/login">
              <button
                class="button is-ghost is-blue big-button medium-text transition-faster"
              >
                <span>{{ $t("common.CANCEL") }}</span>
              </button>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else>
        <img
          src="@/assets/img/gmail_recovery.png"
          :alt="$t('images.RECOVER_WALLET')"
          class="mb-3"
        />
        <div class="white__container">
          <div class="container">
            <div class="py-4">
              <h2 class="title">{{ $t("recovery.RECOVERY_TITLE") }}</h2>
              <p class="subtitle">{{ $t("recovery.ENTER_EMAIL") }}</p>
            </div>
            <form v-on:submit.prevent="checkEmail" novalidate>
              <div class="field">
                <div class="control">
                  <input
                    type="email"
                    class="input"
                    name="newEmail"
                    v-model="newEmail"
                    :placeholder="$t('common.EMAIL')"
                  />
                </div>
              </div>

              <div class="error" v-if="logonError">
                <p data-cy="loginError">⚠️ <span v-html="logonError"></span></p>
              </div>

              <button
                data-cy="confirmButton"
                type="submit"
                class="button is-blue big-button is-login transition-faster"
              >
                <span class="text">{{ $t("common.CONTINUE") }}</span>
              </button>
              <router-link to="/login">
                <button
                  class="button is-ghost is-blue big-button medium-text transition-faster"
                >
                  <span class="text">{{ $t("common.BACK") }}</span>
                </button>
              </router-link>
            </form>
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
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <ChangePassword
        v-if="currentPage === 1"
        :presetOldPassword="oldPassword"
      ></ChangePassword>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";

import RecoverWalletGoogle from "../components/RecoverWalletGoogle.vue";

import ChangePassword from "../components/ChangePassword.vue";
import { Authenticated, Global } from "../mixins/mixins";
import { Recaptcha } from "../mixins/recaptcha";
import { getPayload, validateInput } from "../utils/backupRestore";
import { getDictionaryValue } from "../utils/dictionary";

@Component({
  components: {
    RecoverWalletGoogle,
    ChangePassword,
  },
})
export default class Recovery extends mixins(Authenticated, Global, Recaptcha) {
  currentPage = 0;
  newEmail = "";
  logonError = "";
  oldPassword = "";
  showMore = true;

  async checkEmail() {
    this.logonError = "";

    if (!this.newEmail) {
      return;
    }

    const emailMessage = await validateInput("email", this.newEmail);

    if (emailMessage) {
      this.logonError = emailMessage;
      return;
    }

    try {
      const result: any = await getPayload(this.newEmail, this.recaptchaToken);

      if (result.success) {
        this.setUsersEmail(this.newEmail);
      } else {
        if (result && result.toString() === "TypeError: Failed to fetch") {
          this.showNetworkError(true);
        }

        this.logonError = getDictionaryValue(result.toString());
      }
    } catch (error) {
      if (error.error === "RECAPTCHA_REQUIRED") {
        this.executeRecaptcha(this.checkEmail);
        return;
      }

      if (error && error.toString() === "TypeError: Failed to fetch") {
        this.showNetworkError(true);
      } else {
        if (!error.error) {
          this.logSentryError("checkEmail", error.toString(), {});
        }
      }

      if (error.error) {
        this.logonError = getDictionaryValue(error.error);
      } else {
        this.logonError = getDictionaryValue(error.toString());
      }
    }
  }

  setPassword(data: any) {
    this.logonError = "";

    if (data.success) {
      this.oldPassword = data.oldPassword;
      this.currentPage = 1;
    } else {
      if (data.error === "popup_closed_by_user") {
        this.logonError = getDictionaryValue("GOOGLE_COOKIES_BLOCKED");
      } else if (data.error === "google_script_blocked") {
        this.logonError = getDictionaryValue("GOOGLE_SCRIPT_BLOCKED");
      } else {
        this.logonError = getDictionaryValue("RECOVERY_UNLOCK_ERROR");
      }
      this.currentPage = 0;
    }
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.white__container {
  background: #fff;
  height: 100%;
  border-radius: 14px 14px 5px 5px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
