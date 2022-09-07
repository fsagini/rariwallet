<template>
  <div>
    <ConfirmAccess
      v-if="currentPage === 0"
      @pageBack="pageBack"
      @setPassword="setPassword"
    />
    <div class="">
      <div v-if="currentPage === 1">
        <div class="title-container has-text-left mb-20">
          <div class="flex flex-row">
            <button @click="pageBack()" tag="button" class="back-menu">
              <i class="fa-solid fa-angles-left" />
            </button>
          </div>
          <h2 class="text-white text-2xl ml-3 font-semibold">
            {{ $t("recovery.ACCOUNT_RECOVERY") }}
          </h2>
        </div>
        <div class="white__container settings__container">
          <p class="text_sm">
            {{ $t("recovery.ADD_TRUSTED_ACCOUNT") }}
          </p>

          <div class="error mt-3 mb-3" v-if="logonError">
            <p>⚠️ <span v-html="logonError"></span></p>
          </div>

          <div>
            <AddRecoveryGoogle
              v-if="whatRecovery.google"
              @processMethod="processMethod"
            ></AddRecoveryGoogle>
          </div>

          <div
            v-if="
              !whatRecovery.google || !whatRecovery.facebook || !whatRecovery.vkontakte
            "
          >
            <p
              v-if="
                whatRecovery.google || whatRecovery.facebook || whatRecovery.vkontakte
              "
              class="another-text has-text-left mt-5"
            >
              {{ $t("recovery.ADD_ANOTHER_ACCOUNT") }}
            </p>

            <AddRecoveryGoogle
              v-if="!whatRecovery.google"
              @processMethod="processMethod"
            ></AddRecoveryGoogle>
          </div>
          <div class="divider just-space" />
          <div class="has-text-left mt-5 is-size-7">
            <p class="has-text-weight-bold text-xl">
              <i class="fas fa-shield-alt"></i> {{ $t("recovery.ADD_ACCOUNT_TIP_TITLE") }}
            </p>
            <p class="text_sm">
              {{ $t("recovery.ADD_ACCOUNT_TIP_DESCRIPTION") }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="currentPage === 2">
        <div>
          <img src="@/assets/img/checkmark.svg" alt="Checkmark image" class="mb-3" />
          <h2 class="title">
            {{
              $t("recovery.RECOVERY_ENABLED", {
                currentMethod,
                isEnabled: $t(isEnabled ? "common.ENABLED" : "common.DISABLED"),
              })
            }}
          </h2>
          <p class="subtitle">
            {{
              $t("recovery.TRUSTED_CHANGED", {
                isActivated: $t(isEnabled ? "common.ACTIVATED" : "common.DEACTIVATED")
                  .toString()
                  .toLowerCase(),
              })
            }}
          </p>

          <button
            @click="resetData"
            tag="button"
            class="button outlined-button big-button transition-faster"
          >
            <span class="text">{{ $t("common.CLOSE") }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";
import AddRecoveryGoogle from "../components/AddRecoveryGoogle.vue";
import AddRecoveryFacebook from "../components/AddRecoveryFacebook.vue";
import AddRecoveryVkontakte from "../components/AddRecoveryVkontakte.vue";
import ConfirmAccess from "../components/ConfirmAccess.vue";
import { getDictionaryValue } from "../utils/dictionary";

@Component({
  components: {
    AddRecoveryGoogle,
    AddRecoveryFacebook,
    AddRecoveryVkontakte,
    ConfirmAccess,
  },
})
export default class RecoverySettings extends mixins(Authenticated, Global) {
  currentPage = 0;
  newPassword = "";
  logonError = "";
  currentMethod = "";
  isEnabled = false;
  whatRecovery = {
    facebook: false,
    google: false,
    vkontakte: false,
  };
  processing = {
    facebook: false,
    google: false,
    vkontakte: false,
  };

  async mounted() {
    const facebook = await this.hasRecovery(2);
    const google = await this.hasRecovery(3);
    const vkontakte = await this.hasRecovery(5);

    this.whatRecovery = {
      facebook,
      google,
      vkontakte,
    };
  }

  pageBack() {
    this.redirectUser();
  }

  async setPassword(password: string) {
    if (!password) return;

    this.newPassword = password;
    this.currentPage = 1;
  }

  redirectUser() {
    this.$router.push("/settings").catch(() => undefined);
  }

  processMethod(data: any): void {
    this.logonError = "";

    if (data.success) {
      this.currentMethod = data.method;
      this.isEnabled = data.enabled;
      this.currentPage = 2;
    } else {
      if (data.error === "popup_closed_by_user") {
        this.logonError = getDictionaryValue("GOOGLE_COOKIES_BLOCKED");
      } else if (data.error === "google_script_blocked") {
        this.logonError = getDictionaryValue("GOOGLE_SCRIPT_BLOCKED");
      } else {
        this.logonError = data.method + ": " + getDictionaryValue(data.error);
      }
    }
  }

  async resetData() {
    this.currentPage = 1;
    this.logonError = "";
    this.currentMethod = "";
    this.isEnabled = false;

    const facebook = await this.hasRecovery(2);
    const google = await this.hasRecovery(3);
    const vkontakte = await this.hasRecovery(5);

    this.whatRecovery = {
      facebook,
      google,
      vkontakte,
    };
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;

  .title {
    margin: 0;
  }
}
.settings__container {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}

.another-text {
  margin-bottom: -10px;
}
.fa-shield-alt {
  font-size: 25px;
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
.text_sm {
  font-size: 15px;
}
.white__container {
  background: #fff;
  border-radius: 14px 14px 0 0;
  height: 59vh;
}
@media screen and(max-width: 480px ) {
  .white__container {
    height: 48.9vh;
  }
}
</style>
