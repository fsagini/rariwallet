<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="mb-5 flex">
      <button @click="redirectUser" tag="button" class="back-menu">
        <i class="fa-solid fa-chevron-left" />
      </button>
    </div>
    <div class="mb-5">
      <span class="text-2xl font-bold text-white">Wallet Transactions</span>
    </div>
    <div>
      <div v-if="walletTransactions.length === 0">
        <NoUserTransactions />
      </div>
      <div v-else>
        <div
          class="pt-5 space-y-2 bg-white h-[100%] rounded-br-lg rounded-bl-lg rounded-tr-lg rounded-tl-lg"
        >
          <div class="flex justify-between py-4 px-2">
            <div @click="seeAllTransaction" class="filter__menu space-x-4 shadow-md">
              <span>All Trnsactions</span>
              <i class="fa-solid fa-angle-down"></i>
            </div>
            <div @click="toggleModalOpen" class="filter__menu space-x-4 shadow-md">
              <span>Transactio-Type</span>
              <i class="fa-solid fa-angle-down"></i>
            </div>
          </div>
          <div>
            <div v-if="currentPage === 0">
              <AllTransactions />
            </div>
            <div v-if="currentPage === 1">
              <WithdrawnTransactions />
            </div>
            <div v-if="currentPage === 2">
              <SentTransactions />
            </div>
            <div v-if="currentPage === 3">
              <DepositedTrsansactions />
            </div>
          </div>
        </div>
        <div v-if="isModalOpen">
          <TransactionsModal
            :pageView="currentPage"
            :isModalOpen="isModalOpen"
            @handleModalClose="handleModalClose"
            @changePageView="changePageView"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";
import AllTransactions from "../components/AllTransactions.vue";
import WithdrawnTransactions from "../components/WithdrawnTransactions.vue";
import SentTransactions from "../components/SentTransactions.vue";
import DepositedTrsansactions from "../components/DepositedTrsansactions.vue";
import TransactionsModal from "../components/TransactionsModal.vue";
import NoUserTransactions from "../components/NoUserTransactions.vue";

@Component({
  components: {
    AllTransactions,
    WithdrawnTransactions,
    SentTransactions,
    DepositedTrsansactions,
    TransactionsModal,
    NoUserTransactions,
  },
})
export default class WalletTransactions extends mixins(Authenticated, Global) {
  currentPage = 0;
  isModalOpen = false;
  walletTransactions = this.$store.getters.walletUserTransactions;

  redirectUser() {
    this.$router.push("/").catch(() => undefined);
  }
  changePageView(selected: any) {
    if (selected.optionSelect === "Withdrawn") {
      return (this.currentPage = 1);
    } else if (selected.optionSelect === "Sent") {
      return (this.currentPage = 2);
    } else if (selected.optionSelect === "Deposited") {
      return (this.currentPage = 3);
    } else {
      return (this.currentPage = 0);
    }
  }
  handleModalClose() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleModalOpen() {
    this.isModalOpen = !this.isModalOpen;
  }
  seeAllTransaction() {
    this.currentPage = 0;
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style>
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
.filter__menu {
  padding: 5px 20px;
  background: #edf1f9;
  border-radius: 15px;
}
</style>
