<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="pt-0">
      <div class="flex flex-row">
        <button @click="redirectUser" tag="button" class="back-menu">
          <i class="fa-solid fa-angles-left" />
        </button>
      </div>
      <div class="mb-10 text-yellow-50 font-bold text-2xl"><span>BUY</span></div>
      <swiper
        :slides-per-view="1"
        loop
        :autoplay="true"
        :speed="2500"
        v-if="transformedAssets.length !== 0"
        class="row__container__coins"
      >
        <swiper-slide
          v-for="asset in transformedAssets"
          class="single__asset__price"
          :key="asset.symbol"
        >
          <div class="asset__img">
            <img :src="asset.img" :alt="asset.symbol" />
          </div>
          <div class="symbol">
            <span>{{ asset.symbol }}</span>
          </div>
          <div class="value">
            <span>${{ asset.price }}</span>
          </div>
          <div
            class="perfomance"
            :class="{ loss: asset.change < 0, profit: asset.change > 0 }"
          >
            {{ asset.change > 0 ? "+" + asset.change : asset.change }}%
          </div>
        </swiper-slide>
      </swiper>
      <div v-else>
        <span>asset_loading...</span>
      </div>
    </div>
    <div class="figma">
      <div>
        <div class="pt-2 font-medium text-gray-500">Choose Crypto to Buy</div>
        <div class="flex overflow-x-scroll scrollbar-hide">
          <div v-for="asset in transformedAssets" :key="asset.addr" class="px-2 py-3">
            <span
              @click="changeCoinAndUpdateCoinAddr(asset.name, asset.addr)"
              class="single__asset rounded-2xl cursor-pointer shadow-md"
              >{{ asset.name }}</span
            >
          </div>
        </div>
        <div class="m-4 py-4">
          <form @submit.prevent="executeBuying()">
            <div class="py-4 flex justify-center items-center">
              <input
                class="w-[150px] px-4 bg-none border-none outline-none text-lg font-semibold"
                type="number"
                v-model="kshAmount"
                placeholder="0.00Ksh"
                min="1"
              />
            </div>
            <div class="py-4">
              <span class="text-lg">Transaction Fee {{ transactionAmount }} Ksh.</span>
            </div>
            <div class="py-4">
              <span class="text-lg"
                >You Will Recieve {{ coinsToReceive }} {{ coinType }} coins</span
              >
            </div>
            <div class="actions">
              <button
                :disabled="JSON.parse($store.getters.cryptoWalletAssets).length === 0"
              >
                Buy {{ coinType }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import Component, { mixins } from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { Authenticated, Global } from "../mixins/mixins";
import { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperCore, SwiperSlide } from "swiper-vue2";
import "swiper/swiper-bundle.css";
import VueAxios from "vue-axios";
declare module "vue/types/vue" {
  interface Vue {
    http: typeof VueAxios;
  }
}
SwiperCore.use([Autoplay, Navigation]);

@Component({
  components: {
    Swiper,
    SwiperSlide,
  },
})
export default class BuyAsset extends mixins(Global, Authenticated) {
  kshAmount: string;
  transactionAmount = 0;
  coinsToReceive = 0.0;
  position = 0;
  coinPerfomance: any = [];
  finalPerfomanceData: any = [];
  walletPhoneNumber: string = this.$store.getters.walletPhoneNumber;
  rate: number;
  transformedAssets = JSON.parse(this.$store.getters.cryptoWalletAssets);
  coinType = this.transformedAssets[0].name;
  coinAddr = this.transformedAssets[0].addr;

  changeCoinAndUpdateCoinAddr(coin: string, addr: string) {
    this.coinType = coin;
    this.coinAddr = addr;
  }
  redirectUser() {
    this.$router.push("/").catch(() => undefined);
  }

  @Watch("kshAmount")
  handleWithdrawalAmountChange(newValue: number) {
    // perfome transaction fee actions
    // amount of coins user will receive actions
  }

  async executeBuying() {
    if (!this.kshAmount) {
      this.$vToastify.error("amount field cannot be empty", "EMPTY FIELD");
      return;
    }
    const phonenumber = this.walletPhoneNumber.substring(1);
    const amount = this.kshAmount;
    await this.sendMpesaStkPush({ phonenumber, amount });
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.figma {
  background: #fff;
  border-radius: 14px 14px 0 0;
  height: 65vh;
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
.crypto__asset span {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  display: flex;
  padding-top: 5px;
}
.crypto__asset p {
  color: #fff;
  font-size: 17px;
  font-weight: bold;
  padding-top: 5px;
  display: flex;
  padding-bottom: 10px;
  font-size: 19px;
}
.crypto__asset img {
  height: 30px;
  width: 30px;
  object-fit: cover;
}
.fa-circle-xmark {
  font-size: 40px;
  color: #fff;
  outline: white;
  cursor: pointer;
}
.actions {
  padding-top: 20px;
}
.actions button {
  padding: 15px 80px;
  background: #228cdb;
  outline: none;
  color: #fff;
  border-radius: 24px;
  font-weight: 700;
}
.row__container__coins {
  display: flex;
  overflow-x: scroll;
}

.row__container::-webkit-scrollbar {
  display: none;
}
.row__container__coins::-webkit-scrollbar {
  display: none;
}
.asset__img {
  margin-left: 10px;
  width: 30px;
  height: 30px;
}
.fa-angles-left {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: #fff;
  margin-left: 10px;
  cursor: pointer;
}
.asset__img img {
  width: 30px;
  height: 30px;
  object-fit: cover;
}
.asset_name__price span,
p {
  flex: 1;
  margin-top: 15px;
  font-size: 19px;
}
.asset_name span {
  flex: 1;
  margin-left: 15px;
  margin-top: 10px;
  font-size: 17px;
  font-weight: 600;
}
.single__asset__price {
  display: flex;
  padding: 10px 40px;
  justify-content: space-between;
  background: #fff;
  margin-bottom: 25px;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 24px;
  cursor: pointer;
}
.single__asset {
  padding: 10px 30px;
  justify-content: space-between;
  background: #f1f5fb;
}
.row__container :active {
  content: "";
  background: #bddcf3;
  color: #fff;
  scale: -90;
  animation-duration: 100ms;
}
.symbol span {
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
}
.value span {
  font-size: 23px;
  font-weight: 600;
}
.perfomance {
  padding-left: 10px;
  font-size: 15px;
}
.loss {
  color: #f00;
  font-style: italic;
  font-size: 16px;
  font-weight: 600;
}
.profit {
  color: #438102;
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
}
@media (max-width: 480px) {
  .figma {
    height: 56vh;
  }
}
</style>
