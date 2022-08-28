<template>
  <div>
    <div class="container">
      <h1 class="text-white text-2xl font-bold">Transaction Not Found</h1>
      <p class="pt-5 text-white text-lg">
        Your payment process was either delayed or cancelled during transaction process.
        Please Try Again!
      </p>
    </div>
    <div class="container cancel__img">
      <img src="../assets/img/cancelled-transaction.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Authenticated } from "../mixins/mixins";

export default class CancelledTransaction extends mixins(Authenticated) {
  //
}
</script>

<style scoped>
.cancel__img {
  padding-top: 30px;
}
.cancel__img img {
  width: 300px;
  height: 300px;
}
</style>
