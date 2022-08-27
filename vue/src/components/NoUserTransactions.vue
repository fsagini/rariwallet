<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="center h-[100%] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl">
      <img src="../assets/img/notransaction.png" alt="" />
      <div class="py-1">
        <p class="px-5 text-lg text-white">
          Rari-Pay falicitates buying, selling and sending crypto coins to friends through
          M-Pesa
        </p>
        <p class="font-semibold text-white text-lg px-5">
          You have no transactions at the momment!!
        </p>
      </div>
      <div class="py-4">
        <button @click="navigateBuy" class="rari_buy_asset_button shadow-md">
          Get Started
        </button>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Global } from "../mixins/mixins";
@Component({})
export default class NoUserTransactions extends mixins(Global) {
  navigateBuy() {
    this.router.push("/buy/asset").catch(() => undefined);
  }
}
</script>
