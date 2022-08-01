<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="mb-5 flex">
      <button @click="redirectUser" tag="button" class="back-menu">
        <i class="fa-solid fa-chevron-left" />
      </button>
    </div>
    <div class="container">
      <img class="settings__img" src="../assets/img/change_details.svg" alt="" />
    </div>
    <h2 v-if="!isEmailPasswordPage" class="title">{{ $t("settings.SETTINGS_TITLE") }}</h2>
    <div class="container settings">
      <div class="title-container has-text-left">
        <h2 v-if="isEmailPasswordPage" class="title ml-3">
          {{ $t("settings.EMAIL_AND_PASSWORD") }}
        </h2>
      </div>
      <div class="divider just-space" />
      <div v-if="!isEmailPasswordPage" class="settings">
        <div class="settings-container">
          <div
            data-cy="emailPasswordButton"
            key="email_passowrd"
            class="settings_item"
            @click="changeActive('email_password')"
          >
            <span class="span__text">
              {{ $t("settings.EMAIL_AND_PASSWORD") }}
            </span>
            <span class="icon">
              <i class="fa-solid fa-arrow-right-long" style="opacity: 0.5" />
            </span>
          </div>
          <div
            data-cy="recoverySettings"
            key="recovery"
            class="settings_item"
            @click="changeActive('recovery')"
          >
            <span class="span__text">
              {{ $t("settings.TRUSTED_ACCOUNT") }}
            </span>
            <span class="icon">
              <i class="fa-solid fa-arrow-right-long" style="opacity: 0.5" />
            </span>
          </div>
          <div
            data-cy="verificationSettings"
            key="2FA"
            class="settings_item"
            @click="changeActive('2FA')"
          >
            <span class="span__text">
              {{ $t("settings.2_STEP_VERIFICATION") }}
            </span>
            <span class="icon">
              <i class="fa-solid fa-arrow-right-long" style="opacity: 0.5" />
            </span>
          </div>

          <div
            key="keys"
            class="settings_item"
            data-cy="exportWalletButton"
            @click="changeActive('keys')"
          >
            <span class="span__text">
              {{ $t("settings.EXPORT_WALLET") }}
            </span>
            <span class="icon">
              <i class="fa-solid fa-arrow-right-long" style="opacity: 0.5" />
            </span>
          </div>

          <div
            data-cy="deleteAccountSettings"
            key="delete"
            class="settings_item"
            @click="changeActive('delete')"
          >
            <span class="span__text">
              {{ $t("settings.DELETE_ACCOUNT") }}
            </span>
            <span class="icon">
              <i class="fa-solid fa-arrow-right-long" style="opacity: 0.5" />
            </span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="settings-data">
          <div
            key="email"
            class="settings-link email-password is-flex is-align-items-center reset-cursor"
          >
            <div class="data">
              <p class="span__text">{{ $t("common.EMAIL") }}</p>
              <p>{{ store.email }}</p>
            </div>
            <div class="link">
              <div
                class="login-router transition-faster"
                data-cy="emailChangeButton"
                @click="changeActive('email')"
              >
                <i class="fas fa-pen-square" />
              </div>
            </div>
          </div>
          <div
            key="phonenumber"
            class="settings-link email-password is-flex is-align-items-center reset-cursor"
          >
            <div class="data">
              <p class="span__text">{{ $t("common.PHONE") }}</p>
              <p>{{ store.phonenumber }}</p>
            </div>
            <div class="link">
              <div
                class="login-router transition-faster"
                data-cy="passwordChangeButton"
                @click="changeActive('phonenumber')"
              >
                <i class="fas fa-pen-square" />
              </div>
            </div>
          </div>
          <div
            key="password"
            class="settings-link email-password is-flex is-align-items-center reset-cursor"
          >
            <div class="data">
              <p class="span__text">{{ $t("common.PASSWORD") }}</p>
              <p>********</p>
            </div>
            <div class="link">
              <div
                class="login-router transition-faster"
                data-cy="passwordChangeButton"
                @click="changeActive('password')"
              >
                <i class="fas fa-pen-square" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import ChangePassword from "../components/ChangePassword.vue";
import ChangeEmail from "../components/ChangeEmail.vue";
import Change2FA from "../components/Change2FA.vue";
import AccountRecovery from "../components/AccountRecovery.vue";
import { Authenticated, Global } from "../mixins/mixins";

@Component({
  components: {
    ChangePassword,
    ChangeEmail,
    Change2FA,
    AccountRecovery,
  },
})
export default class Settings extends mixins(Authenticated, Global) {
  activePage = "";
  isEmailPasswordPage = false;

  redirectUser() {
    if (this.activePage === "email_password") {
      this.isEmailPasswordPage = false;
      this.activePage = "";
      return;
    }

    this.$router.push("/").catch(() => undefined);
  }

  changeActive(page: string) {
    this.activePage = page;

    if (page === "email_password") {
      this.isEmailPasswordPage = true;
      return;
    }

    this.$router.push("/settings/" + page).catch(() => undefined);
  }

  mounted() {
    if (this.$route.query.email_password) {
      this.isEmailPasswordPage = true;
      this.activePage = "email_password";
      this.$router.replace({ query: {} });
    }
  }
}
</script>

<style lang="scss" scoped>
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
.span__text {
  color: #000;
  font-weight: 600;
}
a {
  color: #42b983;
}
.back-menu {
  display: flex;
  margin-left: 20px;
  padding: 5px 2px;
  border: 1px solid #fff;
  width: 50px;
  margin-bottom: 20px;
  cursor: pointer;
}
.fa-chevron-left {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #fff;
  margin-left: 10px;
}
.settings {
  background: #fff;
  border-radius: 14px 14px 0 0;
}
.title {
  color: #fff;
  font-size: 25px;
}

.title-container {
  display: flex;
  align-items: center;

  .title {
    margin: 0;
    color: #fff;
  }
}
.settings_item {
  display: flex;
  align-items: center;
  justify-items: stretch;
  justify-content: space-between;
  background: #edf1f9;
  box-shadow: 0px 2px 3px rgba(20, 70, 150, 0.15);
  border-radius: 27px;
  margin-top: 5px;
  padding: 15px;
  width: 100%;
  margin-top: 15px;
  cursor: pointer;
}
.settings-container {
  margin-top: 2%;
  background-color: #fff;
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  flex-direction: column;
  align-items: center;
  height: 44.2vh;
}
@media screen and(max-width: 480px ) {
  .settings-container {
    height: 42.2vh;
  }
}
</style>
