<!-- eslint-disable prettier/prettier -->
<template>
  <div class="wrapper">
    <div v-if="currentPage === 0">
      <h2 class="text-white title">{{ $t("phone.PHONE_SETTINGS_TITLE") }}</h2>
      <h4 class="text-white subtitle">{{ $t("phone.PHONE_SETTINGS_DESCRIPTION") }}</h4>
    </div>

    <div v-if="currentPage === 0">
      <div class="container">
        <img class="pt-10" src="../assets/img/change_number.png" alt="" />
      </div>
      <div class="settings-container">
        <changePhoneNumber @setNewData="setNewData" :error="logonError" />
      </div>
    </div>
    <Change2FAEmail
      v-if="currentPage === 1"
      @setCode="setCode"
      @pageBack="pageBack"
      :error="logonError"
    />
    <div v-if="currentPage === 2">
      <div class="container">
        <h2 data-cy="emailUpdatedTitle" class="text-white title">
          {{ $t("phone.PHONE_UPDATED_TITLE") }}
        </h2>
        <p data-cy="emailUpdatedDescription" class="text-white text-lg subtitle">
          {{ $t("phone.PHONE_UPDATED_DESCRIPTION") }}
        </p>
        <div class="container">
          <img class="pt-10" src="../assets/img/change_number.png" alt="" />
        </div>
        <button @click="resetData" tag="button" class="rari_outlined_button">
          <span class="text-white text-xl text">{{ $t("common.CLOSE") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import changePhoneNumber from "../components/ChangePhoneNumber.vue";
import Change2FAEmail from "../components/Change2FAEmail.vue";
import { Authenticated, Global } from "../mixins/mixins";
import { getDictionaryValue } from "../utils/dictionary";

@Component({
  components: {
    changePhoneNumber,
    Change2FAEmail,
  },
})
export default class PhoneNumberSettings extends mixins(Authenticated, Global) {
  currentPage = 0;
  newPhone = "";
  password = "";
  twoFaSent = false;
  twoFa: any = null;
  logonError = "";

  async submitChange() {
    return this.changePhoneNumber({
      newPhone: this.newPhone,
      password: this.password,
      twoFa: this.twoFa,
    });
  }
  async setNewData(data: any) {
    if (!data.phone || !data.password) return;

    this.newPhone = data.phone;
    this.password = data.password;

    try {
      this.logonError = "";
      await this.submitChange();
      this.currentPage = 1;
      this.twoFaSent = true;
      this.twoFa = false;
    } catch (error) {
      if (error && error.toString() === "TypeError: Failed to fetch") {
        this.showNetworkError(true);
      } else {
        this.logSentryError("setNewData", error.toString(), data);
      }

      this.logonError = getDictionaryValue(error.toString());
    }
  }

  async setCode(code: string) {
    if (!code) {
      return (this.logonError = "please enter verification code");
    }

    this.twoFa = code;

    try {
      this.logonError = "";
      await this.submitChange();

      this.currentPage = 2;
    } catch (error) {
      if (error && error.toString() === "TypeError: Failed to fetch") {
        this.showNetworkError(true);
      } else {
        this.logSentryError("setCode", error.toString(), { code });
      }
      this.logonError = getDictionaryValue(error.toString());
    }
  }

  pageBack() {
    if (this.currentPage > 0) this.currentPage -= 1;
  }

  redirectUser() {
    this.$router.push("/settings").catch(() => undefined);
  }

  resetData() {
    this.currentPage = 0;
    this.newPhone = "";
    this.password = "";
    this.twoFaSent = false;
    this.twoFa = null;
    this.logonError = "";
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
.settings-container {
  background: #fff;
  border-radius: 16px 16px 0 0;
  width: 100%;
  height: 50vh;
  padding: 1%;
  bottom: 0;
}
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
@media (max-width: 480px) {
  .settings-container {
    height: 42.5vh;
  }
}
</style>
