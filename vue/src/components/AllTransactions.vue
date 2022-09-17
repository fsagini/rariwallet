<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div
      v-for="transaction in transactions"
      :key="transaction.id"
      class="assets__trnsactions"
    >
      <router-link
        class="flex space-x-8"
        :to="{
          name: 'SingleTransaction',
          params: {
            id: transaction.id,
            coin: transaction.coinType,
            type: transaction.transactionType,
            date: transaction.date,
            amount: transaction.coins,
            dollarsAmount: transaction.value,
            to: transaction.to,
            from: transaction.from,
            time: transaction.time,
          },
        }"
      >
        <div v-if="transaction.transactionType === 'Deposited'" class="deposited">
          <i class="fa-solid fa-arrow-down"></i>
        </div>
        <div v-if="transaction.transactionType === 'Sent'" class="sent">
          <i class="fa-solid fa-arrow-down"></i>
        </div>
        <div v-if="transaction.transactionType === 'Withdrawn'" class="withdraw">
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
      </router-link>
    </div>
  </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { mixins } from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Authenticated } from "../mixins/mixins";

export default class AllTransactions extends mixins(Authenticated) {
  @Prop()
  transactions: Array<any> = [
    {
      id: "3M8w2knJKsr3jqMatYiyuraxVvZA",
      coins: 0.00987,
      transactionType: "Withdrawn",
      coinType: "BTC",
      addr: "0xECe365B379E1dD183B20fc5f022230C044d51404",
      date: "Jan 24, 2022",
      value: 400,
      from: "0x55ff7c1ed138586b3c01eae47be1cff62583ca7f",
      to: "MPESA",
      time: "12:10 PM",
    },
    {
      id: "S38w2knJKsrgyuqMatYiyuraxVvZA",
      coins: 0.02987,
      coinType: "USDC",
      transactionType: "Deposited",
      addr: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB",
      date: "Aug 24, 2022",
      value: 500,
      from: "0x55ff7c1ed138586b3c01eae47be1cff62583ca7f",
      to: "bo66ff7c1ed138586b3c01eae47be1cff62583ca7f",
      time: "11:45 AM",
    },
    {
      id: "678w2knJKsr3jqMatYiyuraxVvZA",
      coins: 0.005887,
      coinType: "ETH",
      transactionType: "Withdrawn",
      addr: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      date: "Dec 24, 2022",
      value: 300,
      from: "0x55ff7c1ed138586b3c01eae47be1cff62583ca7f",
      to: "MPESA",
      time: "5:46 PM",
    },
    {
      id: "RT68w2knJKsr3jqMatYiyuraxVvZA",
      coins: 0.09987,
      coinType: "ETH",
      transactionType: "Sent",
      addr: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
      date: "Dec 24, 2022",
      value: 678,
      from: "0x55ff7c1ed138586b3c01eae47be1cff62583ca7f",
      to: "bo66ff7c1ed138586b3c01eae47be1cff62583ca7f",
      time: "1:56 PM",
    },
  ];
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

.sent .fa-arrow-down {
  transform: rotate(250deg);
  color: blue;
}

.withdraw .fa-arrow-down {
  transform: rotate(110deg);
  color: red;
}

.deposited .fa-arrow-down {
  transform: rotate(300deg);
  color: green;
}
</style>

3M8w2knJKsr3jqMatYiyuraxVvZA
