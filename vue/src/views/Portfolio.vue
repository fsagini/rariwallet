<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="flex justify-between">
      <div class="px-2 py-2" v-for="menu in walletMenu" :key="menu.title">
        <div
          @click="navigateWallet(menu.link)"
          class="wallet__menu shadow-md rounded-2xl"
        >
          {{ menu.title }}
        </div>
      </div>
    </div>
    <div class="portfolio__header">
      <div class="portfolio__title">
        <div class="ml-3">
          <p class="medium-text has-text-weight-medium">
            <span class="important-font"> {{ formatEthAddress(accounts[0]) }} </span>
            <span class="copy-icon" @click="copyETHAddress(accounts[0])"
              ><i class="fas fa-copy"
            /></span>
          </p>
          <span class="important-font">+254{{ store.phonenumber.substring(1) }} </span>
        </div>
      </div>
    </div>
    <div class="portfolio__wallet">
      <span> $ {{ walletBalance }}</span>
      <p>Wallet Balance</p>
    </div>
    <div class="figma">
      <span class="container__title">Assets</span>

      <!-- Assets Beggining -->
      <div>
        <div v-if="ShowAll === false">
          <div
            v-for="asset in transformedWalletAssets.slice(0, 2)"
            class="assets"
            :key="asset.addr"
          >
            <div class="asset__image">
              <img :src="asset.img" :alt="asset.symbol" />
            </div>
            <div class="balance__details">
              <span style="flex: 1">{{ asset.name }} ({{ asset.symbol }})</span>
              <p>{{ asset.bal }} {{ asset.symbol }}</p>
            </div>
            <!-- coin price increase or decrease dynamic rendering will be added  -->
            <div class="asset__price">
              <span>$ {{ asset.value }}</span>
              <p :class="{ loss: asset.daychange < 0, profit: asset.daychange > 0 }">
                {{ asset.daychange > 0 ? "+" + asset.daychange : asset.daychange }}%
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-for="asset in transformedWalletAssets" class="assets" :key="asset.addr">
            <div class="asset__image">
              <img :src="asset.img" :alt="asset.symbol" />
            </div>
            <div class="balance__details">
              <span>{{ asset.name }} ({{ asset.symbol }})</span>
              <p>{{ asset.bal }} {{ asset.symbol }}</p>
            </div>

            <!-- coin price increase or decrease dynamic rendering will be added  -->
            <div class="asset__price">
              <span>$ {{ asset.value }}</span>
              <p :class="{ loss: asset.daychange < 0, profit: asset.daychange > 0 }">
                {{ asset.daychange > 0 ? "+" + asset.daychange : asset.daychange }}%
              </p>
            </div>
          </div>
        </div>
        <div class="actions">
          <button v-on:click="navigateBuy()">{{ $t("common.Deposit") }}</button>
        </div>
        <span @click="toggleShowAll" class="view__assets">
          <p v-if="!ShowAll">
            {{ $t("common.SEE_ASSETS") }}
          </p>
          <p v-if="ShowAll">
            {{ $t("common.HIDE_ASSETS") }}
          </p>
        </span>
      </div>
      <span class="container__title"> Latest Transactions </span>

      <!-- Transactions Beggining -->
      <div>
        <PortfolioTrnsactions />
      </div>
      <div class="bottom__menu">
        <div class="bottom__icons">
          <span @click="navigateTransactions"
            ><i class="fa-solid fa-arrow-right-arrow-left"> </i>
            <p class="font-semibold text-sm">Transactions</p></span
          >
          <span @click="navigateBuy" class="bottom__deposit"
            ><i class="fa-solid fa-plus"></i
          ></span>
          <span @click="logout()"
            ><i class="fa-solid fa-cube"></i>
            <p class="font-semibold text-sm">Sign-out</p></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Authenticated, Global } from "../mixins/mixins";
import { numberWithCommas } from "../utils/Commaseparator";
import jazzicon from "@metamask/jazzicon";
import { copyToClipboard } from "../utils/utils";
import PortfolioTrnsactions from "../components/PortfolioTrnsactions.vue";
@Component({
  components: {
    PortfolioTrnsactions,
  },
})
export default class Portfolio extends mixins(Global, Authenticated) {
  walletPhoneNumber = this.$store.getters.walletPhoneNumber;
  dropdownIsActive = false;
  selectedAccount = "";
  noRecoveryMethods = false;
  twoFactorActive = false;
  twoFactorEmailActive = false;
  whatRecovery = {
    google: false,
  };
  ShowAll = false;
  menuShowing = false;
  coinPerfomance: any = [];
  finalPerfomanceData: any = [];
  priceChange: any = [];
  walletMenu: any = [
    {
      title: "BUY",
      link: "/buy/asset",
    },
    {
      title: "SELL",
      link: "/withdraw/asset",
    },
    {
      title: "SEND",
      link: "/send/asset",
    },
    {
      title: "PROFILE",
      link: "/settings",
    },
  ];
  transformedWalletAssets = JSON.parse(this.$store.getters.userWalletAssets);
  walletBalance = numberWithCommas(
    this.transformedWalletAssets.reduce((acc: number, curr: any) => {
      return acc + curr.value;
    }, 0)
  );

  toggleShowAll() {
    this.ShowAll = !this.ShowAll;
  }

  copyETHAddress(ethAddress: string): void {
    copyToClipboard(ethAddress);
  }
  logout() {
    this.logoutWallet();
    //this.router.push('/login').catch(() => undefined);;
  }
  generateImage(ethAddress: any): void {
    if (!ethAddress) {
      return;
    }
    const ref: any = this.$refs.userImage;
    if (!ref) {
      if (ethAddress) {
        setTimeout(() => {
          this.generateImage(ethAddress);
        }, 100);
      }
      return;
    }
    ref.innerHTML = "";
    if (!ethAddress) {
      return;
    }
    const seed = parseInt(ethAddress.slice(2, 10), 16);
    if (!seed) return;
    const image = jazzicon(32, seed);
    ref.append(image);
  }
  // Wallet Menu Routes
  navigateWallet(link: string) {
    this.router.push(link).catch(() => undefined);
  }
  // End Wallet
  navigateTransactions() {
    this.router.push("/your/transactions").catch(() => undefined);
  }
  navigateBuy() {
    this.router.push("/buy/asset").catch(() => undefined);
  }

  async mounted() {
    if (this.isIframe() && !this.store.loginComplete) {
      if (this.store.connection && this.store.connection !== null) {
        const promise = this.store.connection.promise;
        (await promise).onLogin(this.store.accounts[0], this.store.email);
      }
    }
    if (this.store.recoveryMethods.length == 1) {
      this.noRecoveryMethods = true;
    }
    if (this.store.twoFaRequired.authenticator) {
      this.twoFactorActive = true;
    }
    if (this.store.twoFaRequired.email) {
      this.twoFactorEmailActive = true;
    }
    if (this.store.accounts && this.store.accounts[0]) {
      this.generateImage(this.store.accounts[0]);
    }
    const google = await this.hasRecovery(3);

    this.whatRecovery = {
      google,
    };
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.loss {
  color: #f00;
  font-size: 12px !important;
}
.profit {
  color: #438102;
  font-size: 12px !important;
}
.wallet__menu {
  padding: 5px 15px;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}
.container__title {
  display: flex;
  padding-left: 10px;
  margin-bottom: 5px;
  font-size: 19px;
  font-weight: 600;
}
.copy-icon {
  color: #000;
  cursor: pointer;
}
.menu__button {
  background: none;
  border: none;
}
.transaction__avatar {
  margin-left: 20px;
}
.actions button {
  padding: 10px 60px;
  border: 1px dotted #9ea5b1;
  border-radius: 24px;
  background: #fff;
  color: #9ea5b1;
  font-size: 20px;
  cursor: pointer;
}
.bottom__headers,
.bottom__icons span p {
  justify-content: space-between;
  margin: 0 25px 0 25px;
  margin-top: 0;
  padding-bottom: 20px;
}
.bottom__headers p {
  font-size: 16px;
  color: #979797;
}
.bottom__menu {
  background: #cfd2d8;
  border-radius: 20px 20px 0px 0;
  padding-top: 30px;
  margin-top: 30px;
  height: 23.3vh;
}

.bottom__deposit {
  border-radius: 50%;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
  display: flex;
  background: #347af0;
  transform: translate(-20%, -90%);
}
.bottom__icons {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin: 0 25px 0 25px;
  padding-bottom: 20px;
}
.fa-arrow-right-arrow-left,
.fa-plus,
.fa-cube {
  font-size: 30px;
  cursor: pointer;
}
.fa-plus {
  color: #fff;
}
.fa-arrow-right-arrow-left,
.fa-cube {
  color: #979797;
}
.fa-arrow-down {
  display: flex;
  color: #f00;
  justify-content: center;
  font-size: 19px;
}
.fa-money-bill-transfer {
  display: flex;
  color: #347af0;
  justify-content: center;
  align-items: center;
  font-size: 19px;
}
.fa-arrow-right-from-bracket {
  color: #75bf72;
  display: flex;
  justify-content: center;
  font-size: 19px;
}
.withdraw {
  width: 30px;
  height: 30px;
  border: 1px solid #f00;
  background: #fff;
  border-radius: 50%;
}
.sent {
  width: 30px;
  height: 30px;
  border: 1px solid #347af0;
  background: #fff;
  border-radius: 50%;
}
.deposited {
  width: 30px;
  height: 30px;
  border: 1px solid #75bf72;
  background: #fff;
  border-radius: 50%;
}
.assets {
  margin-right: 10px;
  margin-left: 10px;
  display: flex;
  background: #edf1f9;
  border-radius: 50px;
  padding: 10px 20px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.view__assets p {
  padding: 15px 15px;
  font-size: 17px;
  cursor: pointer;
  color: #347af0;
}
.asset__image {
  margin-left: 20px;
  padding-top: 10px;
}
.asset__image img {
  width: 30px;
  height: 30px;
  object-fit: cover;
}
.balance__details,
.asset__price {
  flex: 1;
}
.balance__details span,
.asset__price span {
  text-align: start;
  font-weight: 600;
}
.balance__details p,
.asset__price p {
  font-size: 16px;
}
.figma {
  background: #fff;
  border-radius: 14px 14px 0 0;
  padding-top: 30px;
}

.portfolio__title span,
.portfolio__header {
  font-size: 18px;
  color: #fff;
}
.arrow__left .fa-less-than {
  font-size: 17px;
  color: #fff;
}
.portfolio__menu .fa-bars,
.fa-x {
  font-size: 32px;
  color: #fff;
  cursor: pointer;
}
.portfolio__wallet {
  padding-bottom: 30px;
}
.portfolio__wallet span {
  font-size: 33px;
  color: #fff;
  font-weight: bold;
}
.portfolio__wallet p {
  color: #fff;
  font-size: 16px;
}

.menu__row {
  height: 50px;
  width: 100%;
  border: 1px solid #f9fafc;
  border-radius: 10px;
  display: flex;
  margin: 0%;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  align-items: center;
}

.menu__row #icon {
  flex: 30%;
  font-size: 25px;
  color: #228cdb;
}
.menu__row #title {
  flex: 30%;
  font-size: 19px;
}
.list-move {
  transition: all 1s;
}
.user__details {
  display: flex;
  justify-content: center;
  color: #fff;
  font-size: 25px;
}
.menu__slide {
  overflow-x: scroll;
}
.menu__slide::-webkit-scrollbar {
  display: none;
}
@media screen and(max-width:480) {
  .bottom__menu {
    height: 24.3vh;
  }
}
</style>
