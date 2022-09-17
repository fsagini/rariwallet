<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="container">
      <h1 class="text-white text-2xl font-bold">Transaction Not Found</h1>
      <p class="pt-5 text-white text-lg">
        Your payment process was either delayed or cancelled during transaction process.
        Please Try Again!
      </p>
    </div>
    <div class="flex justify-center items-center cancel__img">
      <img src="../assets/img/cancelled-transaction.png" alt="" />
    </div>
    <div class="py-4">
      <button @click="navigateBack()" class="navigate__back">
        Try Another Transaction
      </button>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";

export default class CancelledTransaction extends mixins(Authenticated, Global) {
  navigateBack() {
    this.router.push("/buy/asset").catch(() => undefined);
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.cancel__img {
  padding-top: 30px;
}
.cancel__img img {
  width: 250px;
  height: 250px;
}
.navigate__back {
  padding: 15px 80px;
  background: #fff;
  color: blue;
  border-radius: 16px;
  cursor: pointer;
}
</style>
