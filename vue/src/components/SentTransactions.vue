<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div
      v-for="transaction in sentTransactions"
      :key="transaction.id"
      class="assets__trnsactions"
    >
      <div v-if="transaction.transactionType === 'Sent'" class="sent">
        <i class="fa-solid fa-arrow-down"></i>
      </div>

      <div>
        <p class="flex font-bold">${{ transaction.value }}</p>
        <p>{{ transaction.coins }} {{ transaction.coinType }}</p>
      </div>
      <div>
        <p class="font-bold text-red-500">{{ transaction.transactionType }}</p>
        <p>{{ transaction.date }}</p>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { mixins } from "vue-class-component";
import { Authenticated } from "../mixins/mixins";

export default class SentTransactions extends mixins(Authenticated) {
  transactions: Array<any> = [
    {
      id: "tyu567885567",
      coins: 0.00987,
      transactionType: "Withdrawn",
      coinType: "BTC",
      addr: "0xECe365B379E1dD183B20fc5f022230C044d51404",
      date: "Jan 24, 2022",
      value: 400,
    },
    {
      id: "6778yuui8",
      coins: 0.02987,
      coinType: "USDC",
      transactionType: "Deposited",
      addr: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
      date: "Aug 24, 2022",
      value: 500,
    },
    {
      id: "45yjkkij7890",
      coins: 0.005887,
      coinType: "ETH",
      transactionType: "Withdrawn",
      addr: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      date: "Dec 24, 2022",
      value: 300,
    },
    {
      id: "345fg678fghh",
      coins: 0.09987,
      coinType: "ETH",
      transactionType: "Sent",
      addr: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      date: "Dec 24, 2022",
      value: 678,
    },
  ];
  sentTransactions = this.transactions.filter((transaction) => {
    return transaction.transactionType === "Sent";
  });
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.assets__trnsactions {
  margin-right: 15px;
  margin-left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #edf1f9;
  border-radius: 50px;
  padding: 10px 20px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.sent {
  padding: 5px 5px;
  border: 2px solid blue;
  border-radius: 50%;
}
.sent .fa-arrow-down {
  transform: rotate(250deg);
  color: blue;
}
</style>
