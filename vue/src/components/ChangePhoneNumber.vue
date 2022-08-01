<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div>
      <div>
        <div class="card-content container">
          <div class="content">
            <div class="push__down"></div>
            <div class="field">
              <div class="border-b-2 border-y-black">
                <input
                  data-cy="newPhone"
                  class="bg-none outline-none border-none p-2 text-lg"
                  name="newPhone"
                  type="string"
                  v-model="newPhone"
                  :placeholder="$t('common.NEW_PHONE')"
                />
              </div>
            </div>
            <div class="field">
              <div class="border-b-2 border-y-black">
                <input
                  data-cy="confirmPassword"
                  type="password"
                  class="bg-none outline-none border-none p-2 text-lg"
                  name="password"
                  v-model="password"
                  :placeholder="$t('common.PASSWORD')"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="error ml-4 text-black" v-if="logonError">
          <p>⚠️ <span v-html="logonError"></span></p>
        </div>

        <div class="mt-5">
          <button
            class="rari_buttons"
            data-cy="updateEmailButton"
            :disabled="!newPhone || !password"
            @click="
              setNewData({
                phone: newPhone,
                password: password,
              })
            "
          >
            <span class="text confirm-button">{{ $t("phone.UPDATE_PHONENUMBER") }}</span>
          </button>
          <button
            v-on:click="
              $router.push('/settings?email_password=true').catch(() => undefined)
            "
            tag="button"
            class="button is-ghost is-blue big-button medium-text transition-faster"
          >
            <span class="text-black fontweight-semibold">{{ $t("common.CANCEL") }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { validateInput } from "../utils/backupRestore";
import { sha256 } from "../utils/cryptoFunctions";
import Component, { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";
import { Emit, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class ChangePhoneNumber extends mixins(Global, Authenticated) {
  newPhone = "";
  password = "";
  logonError = "";

  @Prop()
  error!: string;

  @Watch("error")
  handleErorrChange(newValue: string) {
    if (newValue) this.logonError = newValue;
  }

  @Emit("setNewData")
  async setNewData(data: any) {
    this.logonError = "";

    if (!data.phone) {
      return { phone: null, password: null };
    }

    const phonenumberMessage = await validateInput("phonenumber", data.phone);
    if (phonenumberMessage) {
      this.logonError = phonenumberMessage;

      return { phone: null, password: null };
    }
    const newPassword = await sha256(data.password);

    if (this.store.hashedPassword !== newPassword) {
      this.logonError = this.$t("errors.WRONG_PASSWORD").toString();
      return { phone: null, password: null };
    }
    if (data.phone.length !== 10) {
      this.logonError = "check your phone number characters";
      return { phone: null, password: null };
    }

    if (this.store.phonenumber === this.newPhone) {
      this.logonError = this.$t("errors.SAME_PHONENUMBER").toString();
      return { phone: null, password: null };
    }

    return { phone: data.phone, password: newPassword };
  }
}
</script>

<style scoped>
.confirm-button {
  font-size: 18px;
}

.white__container {
  background: #fff;
  border-radius: 14px 14px 0 0;
  height: 51.7vh;
}
.button__update {
  padding: 14px 80px;
  background: #000;
  color: #fff;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
}
</style>
