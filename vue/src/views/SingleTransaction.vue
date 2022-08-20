<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="text-white text-xl font-semibold">Transaction Details</div>
    <div class="bg-white h-[100%] rounded-tl-2xl rounded-br-2xl ml-10">
      <div class="py-5">
        <div v-if="transaction_type === 'Deposited'">
          <span class="font-bold text-lg text-green-500">Deposited</span>
        </div>
        <div v-if="transaction_type === 'Sent'">
          <span class="font-bold text-lg text-blue-500">Sent</span>
        </div>
        <div v-if="transaction_type === 'Withdrawn'">
          <span class="font-bold text-lg text-red-500">Withdrawn</span>
        </div>

        <div class="flex py-4 justify-between px-5">
          <div>
            <p class="flex text-gray-400">Date</p>
            <p class="text-lg">{{ transaction_date }}</p>
          </div>
          <div>
            <p class="flex text-gray-400">Time</p>
            <p class="text-lg">{{ time }}</p>
          </div>
        </div>
        <div class="border-gray-400 border-[1px] w-full mt-3 ml-5" />
        <div class="ml-0">
          <div class="">
            <p class="text-gray-400">Total Amount</p>
            <p class="text-lg font-semibold">{{ coins_amount }} {{ coin_type }}</p>
          </div>
          <div class="">
            <p class="text-gray-400">Total Amount ($)</p>
            <p class="text-lg font-semibold">${{ dollars_amount }}</p>
          </div>
          <div class="">
            <p class="text-gray-400">Status</p>
            <p class="text-lg text-blue-400 font-semibold">
              Transaction confirmed <i class="fa-solid fa-up-right-from-square"></i>
            </p>
          </div>
        </div>
        <div class="border-gray-400 border-[1px] w-full mt-3 ml-5" />
        <div>
          <div class="">
            <p class="text-gray-400">Transaction ID</p>
            <p class="text-lg font-semibold">{{ trasansaction_id }}</p>
          </div>
          <div class="">
            <p class="text-gray-400">From</p>
            <p class="text-lg font-semibold">
              {{ formatEthAddress(unformated_from_user) }}
            </p>
          </div>
          <div class="">
            <p class="text-gray-400">To</p>
            <p class="text-lg font-bold text-gray-700">
              {{ formatEthAddress(unformated_to_user) }}
            </p>
          </div>
        </div>
      </div>
      <div class="transaction__button">
        <button @click="redirectUser">Back to Transactions</button>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->

<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";
@Component({})
export default class SingleTransaction extends mixins(Global, Authenticated) {
  transaction_type = localStorage.getItem("transaction_type");
  coin_type = localStorage.getItem("coin_type");
  transaction_date = localStorage.getItem("transaction_date");
  trasansaction_id = localStorage.getItem("trasansaction_id");
  coins_amount = localStorage.getItem("coins_amount");
  dollars_amount = localStorage.getItem("dollars_amount");
  unformated_from_user = localStorage.getItem("unformated_from_user");
  unformated_to_user = localStorage.getItem("unformated_to_user");
  time = localStorage.getItem("time");

  redirectUser() {
    this.router.push("/your/transactions").catch(() => undefined);
  }

  async mounted() {
    // Static storage for details incase of reload
    window.localStorage.setItem("transaction_type", this.$route.params.type);
    window.localStorage.setItem("coin_type", this.$route.params.coin);
    window.localStorage.setItem("transaction_date", this.$route.params.date);
    window.localStorage.setItem("trasansaction_id", this.$route.params.id);
    window.localStorage.setItem("coins_amount", this.$route.params.amount);
    window.localStorage.setItem("dollars_amount", this.$route.params.dollarsAmount);
    window.localStorage.setItem("unformated_from_user", this.$route.params.from);
    window.localStorage.setItem("unformated_to_user", this.$route.params.to);
    window.localStorage.setItem("time", this.$route.params.time);
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
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
.transaction__button button {
  padding: 10px 30px;
  background: #347af0;
  border-radius: 20px;
  color: #fff;
  font-size: 19px;
}
</style>
