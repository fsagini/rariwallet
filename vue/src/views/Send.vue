<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="flex flex-row">
      <button @click="redirectUser()" tag="button" class="back-menu">
        <i class="fa-solid fa-angles-left" />
      </button>
    </div>
    <p class="text-3xl font-bold text-yellow-50 mb-10">Transfer Crypto</p>
    <div class="figma rounded-br-md rounded-bl-md">
      <span class="text-lg text-gray-400">Choose Crypto to Send</span>
      <div
        class="flex px-4 py-4 space-x-4 justify-between overflow-x-scroll scrollbar-hide"
      >
        <div v-for="assets in walletAssets" :key="assets.id">
          <div
            @click="UpdateUserCryptoBal(assets.bal, assets.symbol)"
            class="row__asset shadow-sm rounded-xl text-lg cursor-pointer"
          >
            {{ assets.symbol }}
          </div>
        </div>
      </div>
      <p class="mt-5 text-md font-light text-grey-400">
        {{ coinBallance }} {{ coinType }} Coins Available
      </p>
      <form
        @submit.prevent="executeSending()"
        class="flex justify-center flex-col align-middle"
      >
        <div class="w-60 py-4 ml-10">
          <input
            type="number"
            class="px-4 border-none font-light cursor-text outline-none t text-lg bg-none"
            placeholder="0.00"
            step=".00000001"
            v-model="coinsAmount"
            min=".00000001"
          />
        </div>
        <div class="w-60 py-4 ml-10">
          <input
            type="text"
            placeholder="Wallet Address Sending To"
            class="px-4 font-light outline-none text-lg bg-none cursor-text border-none"
            v-model="walletAddress"
          />
        </div>
        <div class="w-60 py-4 ml-10">
          <span class="px-4 outline-none bg-none border-none text-lg text-grey">
            Transaction Fee: {{ transactionFee }}
          </span>
        </div>

        <div class="mt-5 mb-5">
          <button class="w_button">Transfer {{ coinType }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";
import WAValidator from "multicoin-address-validator";

export default class Withdraw extends mixins(Global, Authenticated) {
  walletAssets = JSON.parse(this.$store.getters.userWalletAssets);
  coinBallance = this.walletAssets[0].bal;
  coinType = this.walletAssets[0].symbol;
  coinsAmount: number;
  walletAddress: string;
  transactionFee = 0.0;

  UpdateUserCryptoBal(ballance: any, coinType: any) {
    this.coinBallance = ballance;
    this.coinType = coinType;
    console.log(this.coinType, this.coinBallance);
  }

  redirectUser() {
    this.$router.push("/").catch(() => undefined);
  }

  executeSending() {
    if (!this.coinsAmount || !this.walletAddress) {
      this.$vToastify.error(
        "amount or wallet address field cannot be empty",
        "EMPTY FIELD"
      );
      this.hideSpinner();
      return;
    }
    const valid = WAValidator.validate(this.walletAddress, this.coinType);
    if (!valid) {
      this.$vToastify.error(
        `Your ${this.coinType} wallet address input sending to  is invalid`,
        "TRANSFER ERROR"
      );
      return this.hideSpinner();
    }
    if (this.coinsAmount > this.coinBallance - this.transactionFee) {
      this.$vToastify.error(
        `You do not have enought ${this.coinType} coins to complete this transaction`,
        "AMOUNT ERROR"
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
.figma {
  background: #fff;
  border-radius: 14px 14px 0px 0px;
}
.row__asset {
  padding: 5px 25px;
  background: #bddcf3;
}

.fa-angles-left {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #fff;
  margin-left: 10px;
}
.back-menu {
  display: flex;
  margin-left: 20px;
  padding: 10px 2px;
  border: 1px solid #fff;
  width: 50px;
  margin-bottom: 20px;
  cursor: pointer;
}
.asset_name span {
  flex: 1;
  margin-left: 15px;
  margin-top: 10px;
  font-size: 17px;
}
.single__asset {
  display: flex;
  flex-direction: row;
  padding: 10px 30px;
  justify-content: space-between;
  background: rgb(230, 227, 227);
  margin: 10px;
  border-radius: 24px;
  cursor: pointer;
}
.row__container :active {
  content: "";
  background: #bddcf3;
  color: #fff;
  scale: -90;
  animation-duration: 100ms;
}
.w_button {
  padding: 10px 60px;
  background: #228cdb;
  outline: none;
  border-radius: 20px;
  color: #fff;
  font-size: 20px;
}
</style>
