<template>
  <div>
    <div v-if="currentPage === 0" class="title-container has-text-left">
      <div class="flex flex-row">
        <button @click="redirectUser()" tag="button" class="back-menu">
          <i class="fa-solid fa-angles-left" />
        </button>
      </div>
      <h2 class="title ml-3 text-white">{{ $t("settings.2_STEP_VERIFICATION") }}</h2>
    </div>
    <div v-if="currentPage === 0" class="white__container__two container">
      <div class="divider just-space" />
      <div class="mb-10" />
      <Change2FA @setCurrentMethod="setCurrentMethod" />
    </div>
    <div v-if="currentPage === 1">
      <ConfirmAccess @setPassword="setPassword" @pageBack="pageBack" />
    </div>
    <div v-if="currentPage === 2">
      <ChangeAuthenticator
        v-if="currentMethod === 'authenticator'"
        :qrCode="qrCode"
        @setCode="setCode"
        @pageBack="pageBack"
      />
      <Change2FAEmail
        v-if="currentMethod === 'email'"
        @setCode="setCode"
        @pageBack="pageBack"
      />
    </div>
    <div v-if="currentPage === 3">
      <div>
        <div class="container">
          <img
            class="confirmed__img"
            src="@/assets/img/email_confirmed.svg"
            alt="Checkmark image"
          />
        </div>
        <div class="white__container container">
          <h2 data-cy="2faConfirmedTitle" class="title p-5">
            {{
              $t("2fa.2_STEP_ACTIVATED", {
                isActivated: isEnabling
                  ? $t("common.ACTIVATED")
                  : $t("common.DEACTIVATED"),
              })
            }}
          </h2>
          <p data-cy="2faConfirmedDescription" v-if="isEnabling" class="subtitle">
            {{ $t("2fa.2_STEP_ADDED") }}
          </p>
          <p data-cy="2faDisabledDescription" v-else class="subtitle">
            {{ $t("2fa.2_STEP_REMOVED") }}
          </p>

          <div v-if="!isEnabling" class="alert warning mt-3 is-size-7 has-text-left mb-5">
            ⚠ {{ $t("2fa.2_STEP_REMOVED_WARNING") }}
          </div>

          <button
            @click="resetData"
            tag="button"
            class="button outlined-button big-button transition-faster"
          >
            <span data-cy="closeButton" class="text">{{ $t("common.CLOSE") }}</span>
          </button>

          <div v-if="isEnabling">
            <div class="divider"></div>
            <p class="has-text-left has-text-weight-bold mb-0">
              {{ $t("2fa.KYC_TITLE") }}
            </p>
            <p class="has-text-left subtitle mt-0">{{ $t("2fa.KYC_DESCRIPTION") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import Change2FA from "../components/Change2FA.vue";
import ConfirmAccess from "../components/ConfirmAccess.vue";
import ChangeAuthenticator from "../components/ChangeAuthenticator.vue";
import Change2FAEmail from "../components/Change2FAEmail.vue";
import { Authenticated, Global } from "../mixins/mixins";
import { getDictionaryValue } from "../utils/dictionary";
import { Watch } from "vue-property-decorator";

@Component({
  components: {
    Change2FA,
    ConfirmAccess,
    ChangeAuthenticator,
    Change2FAEmail,
  },
})
export default class TwoFactorSettings extends mixins(Authenticated, Global) {
  currentPage = 0;
  currentMethod = "";
  qrCode = "";
  authenticatorCode = "";
  emailCode = "";
  email = false;
  authenticator = false;
  authenticatorConfirmed: any = false;
  isEnabling = true;
  updateError = "";
  passwordTimeout: number | undefined = undefined;

  async submitChange(type: "email" | "authenticator") {
    try {
      this.updateError = "";
      if (type === "email") {
        this.showSpinner(this.$t("loader.LOADING").toString());
        let email = true;
        let authenticator = false;

        if (!this.isEnabling) {
          email = false;
          authenticator = this.authenticator;
        }

        await this.change2FAMethods({
          email,
          authenticator,
          email2faVerification: this.emailCode,
          authenticator2faVerification: this.authenticatorCode,
        });

        if (this.isEnabling && !this.emailCode) {
          this.email = false;
          this.currentPage = 2;
        } else {
          this.authenticatorConfirmed = true;
          this.email = email;
          this.authenticator = authenticator;
          this.isEnabling = email;
          this.currentPage = 3;
        }
      } else if (type === "authenticator") {
        this.showSpinner(this.$t("loader.LOADING").toString());

        let email = false;
        let authenticator = true;

        if (!this.isEnabling) {
          email = this.email;
          authenticator = false;
        }

        await this.change2FAMethods({
          email,
          authenticator,
          email2faVerification: this.emailCode,
          authenticator2faVerification: this.authenticatorCode,
        });

        this.email = email;
        this.authenticator = authenticator;
        this.authenticatorConfirmed = authenticator;
        this.currentPage = 3;
      }

      this.hideSpinner();
    } catch (error) {
      this.hideSpinner();
      if (error && error.toString() === "TypeError: Failed to fetch") {
        this.showNetworkError(true);
      } else {
        this.logSentryError("submitChange", error.toString(), {});
      }
      this.updateError = getDictionaryValue(error.toString());
      this.$vToastify.error(this.updateError, "WALLET ERROR");
    }
  }

  async generateQR() {
    this.authenticatorConfirmed = false;
    this.authenticatorCode = "";

    this.qrCode = ((await this.generateQRCode()) as any).image;
    return false;
  }

  async mounted() {
    this.email = this.store.twoFaRequired.email;
    this.authenticator = this.store.twoFaRequired.authenticator;
    this.authenticatorConfirmed = this.store.twoFaRequired.authenticatorConfirmed;
  }

  redirectUser() {
    this.$router.push("/settings").catch(() => undefined);
  }

  pageBack() {
    if (
      this.currentMethod === "authenticator" &&
      !this.authenticator &&
      this.currentPage === 2
    ) {
      this.currentPage = 0;
      this.qrCode = "";
      this.authenticatorCode = "";
    } else {
      if (this.currentPage > 0) this.currentPage -= 1;
    }
  }

  setCurrentMethod(method: any) {
    this.isEnabling = method["isEnabling"];
    this.currentMethod = method["method"];
    this.currentPage = 1;
  }

  @Watch("currentPage")
  currentPageChange(newValue: number) {
    if (newValue !== 2 && this.passwordTimeout) {
      clearTimeout(this.passwordTimeout);
    }
  }

  setPassword(password: string) {
    if (!password) {
      return;
    }

    if (this.currentMethod === "email") {
      this.emailCode = "";
      this.submitChange("email");
      return;
    }

    if (this.passwordTimeout) clearTimeout(this.passwordTimeout);
    this.passwordTimeout = window.setTimeout(() => {
      clearTimeout(this.passwordTimeout);
      this.currentPage = 0;
    }, 600000);

    if (!this.authenticator) {
      this.generateQR();
      this.currentPage = 2;
    } else {
      this.submitChange("authenticator");
    }
  }

  resetData() {
    this.currentPage = 0;
    this.currentMethod = "";
  }

  setCode(code: string) {
    if (!code) return;

    if (this.currentMethod === "email") {
      this.emailCode = code;
      this.submitChange("email");
      return;
    }

    this.authenticatorCode = code;
    this.submitChange("authenticator");
  }
}
</script>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
}
.confirmed__img img {
  width: 150px;
  height: 150px;
}
.fa-angles-left {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}
.back-menu {
  display: flex;
  margin-left: 20px;
  padding: 10px 2px;
  border: 1px solid #fff;
  width: 50px;
  cursor: pointer;
}
.white__container__two {
  background: #fff;
  border-radius: 14px 14px 0 0;
  height: 65vh;
}
.white__container {
  background: #fff;
  border-radius: 14px 14px 0 0;
  height: 49.9vh;
}
@media screen and(max-width: 480px ) {
  .white__container {
    height: 31.6vh;
  }
  .white__container__two {
    height: 31vh;
  }
}
</style>
