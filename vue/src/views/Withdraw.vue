<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <span class="pb-6" @click="NavigateBack()"
      ><i class="fa-solid fa-circle-xmark"></i
    ></span>
    <p class="text-3xl font-bold text-yellow-50 mb-10">Sell Asset</p>
    <div class="figma">
      <span class="text-lg text-gray-400 py-6">Choose Crypto to Sell</span>
      <div
        class="flex px-4 py-4 space-x-4 justify-between overflow-x-scroll scrollbar-hide"
      >
        <div v-for="assets in walletAssets" :key="assets.id">
          <span
            @click="updateBallance(assets.bal, assets.symbol, assets.addr)"
            class="row__asset shadow-sms rounded-xl text-lg"
            >{{ assets.symbol }}</span
          >
        </div>
      </div>
      <p class="mt-2 text-lg text-black-500">
        {{ coinBallance }} {{ coinType }} Available
      </p>
      <form
        @submit.prevent="executeWithdrawal()"
        class="flex justify-center flex-col cursor-text align-middle"
      >
        <div class="w-60 py-4 ml-10">
          <input
            type="text"
            class="px-4 outline-none bg-none border-none text-sm"
            placeholder="0.00"
            v-model.number="withdrawalAmount"
            step=".00000001"
          />
        </div>
        <div class="w-60 py-4 ml-10">
          <span type="text" disabled class="px-4 text-md text-gray-500"
            >You Will Receive {{ totalAmountKsh }} Ksh</span
          >
        </div>
        <div class="w-60 py-4 ml-10">
          <span class="px-4 text-md text-gray-500"
            >Transaction Fee {{ transactionAmount }} Ksh</span
          >
        </div>
        <div class="mt-5 mb-5">
          <button type="submit" class="w_button">Sell {{ coinType }} Asset</button>
        </div>
      </form>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { mixins } from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { Authenticated, Global } from "../mixins/mixins";
import VueToastify from "vue-toastify";
declare module "vue/types/vue" {
  interface Vue {
    $vToastify: typeof VueToastify;
  }
}
export default class Withdraw extends mixins(Global, Authenticated) {
  totalAmountKsh = 0;
  transactionAmount = 0;
  withdrawalAmount: number;

  walletAssets = JSON.parse(this.$store.getters.userWalletAssets);

  coinBallance = this.walletAssets[0].bal;
  coinType = this.walletAssets[0].symbol;
  coinAddress = this.walletAssets[0].addr;
  @Watch("coinBallance")
  onCoinBallanceChange(newValue: number) {
    if (newValue) {
      this.coinBallance = newValue;
    }
  }
  @Watch("coinType")
  onCoinTypChange(newValue: number) {
    if (newValue) {
      this.coinType = newValue;
    }
  }

  updateBallance(bal: number, symbol: string, addr: string) {
    this.coinBallance = bal;
    this.coinType = symbol;
    this.coinAddress = addr;
    window.console.log(this.coinBallance);
    window.console.log(this.coinType);
    window.console.log(this.coinAddress);
  }
  NavigateBack() {
    this.$router.push("/").catch(() => undefined);
  }

  @Watch("withdrawalAmount")
  handleWithdrawalAmountChange(newValue: number) {
    // perfome transaction fee actions
    // amount user will receive actions
  }
  executeWithdrawal() {
    if (!this.withdrawalAmount) {
      this.$vToastify.error("amount field cannot be empty", "EMPTY FIELD");
      this.hideSpinner();
      return;
    }
    if (this.withdrawalAmount > this.coinBallance) {
      this.$vToastify.error(
        `You do not have enough ${this.coinType} coins to complete this transaction`,
        "WALLET ERROR"
      );
      this.hideSpinner();
      return;
    }
    this.showSpinner("performing blockchain transactions...");
    // performe withdrawal functions
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.fa-circle-xmark {
  font-size: 40px;
  transform: translate(0%, -50%);
  color: #fff;
  outline: white;
  cursor: pointer;
}
.row__asset {
  padding: 5px 25px;
  background: #bddcf3;
}

.figma {
  background: #fff;
  border-radius: 14px 14px 14px 14px;
}
.w_button {
  padding: 10px 60px;
  background: #228cdb;
  outline: none;
  border-radius: 20px;
  color: #fff;
  font-size: 20px;
  font-family: sans-serif;
  font-weight: 600;
}
</style>
