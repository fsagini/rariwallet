<template>
	<div>
		<div class="pt-0">
			<div class="flex flex-row">
				<button @click="redirectUser" tag="button" class="back-menu">
					<i class="fa-solid fa-angles-left" />
				</button>
			</div>
			<div class="mb-10 text-yellow-50 font-bold text-2xl"><span>BUY</span></div>
			<swiper :slides-per-view="1" loop :autoplay="true" :speed="2500" v-if="transformedAssets.length !== 0" class="row__container__coins">
				<swiper-slide v-for="asset in transformedAssets" class="single__asset__price" :key="asset.symbol">
					<div class="asset__img">
						<img :src="asset.img" :alt="asset.symbol" />
					</div>
					<div class="symbol">
						<span>{{ asset.symbol }}</span>
					</div>
					<div class="value">
						<span>${{ asset.value }}</span>
					</div>
					<div class="perfomance" :class="{ loss: asset.daychange < 0, profit: asset.daychange > 0 }">
						{{ asset.daychange > 0 ? '+' + asset.daychange : asset.daychange }}%
					</div>
				</swiper-slide>
			</swiper>
			<div v-else>
				<span>asset_loading...</span>
			</div>
		</div>
		<div class="figma">
			<div>
				<span v-if="rate" class="py-6 text-lg text-blue-500 font-semibold">Exchange Rate 1$ = {{ rate }}Ksh</span>

				<span v-else class="text-blue-500 font-semibold">currency-exchange loading...</span>
				<div class="pt-2 font-medium text-gray-500">Choose Crypto to Buy</div>
				<div class="row__container">
					<div class="single__asset" v-for="asset in assets" :key="asset.addr" @click="changeCoinAndUpdateCoinAddr(asset.name, asset.addr)">
						<div class="asset__img">
							<img :src="asset.img" alt="" />
						</div>
						<div class="asset_name">
							<span>{{ asset.name }}</span>
						</div>
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
							<span class="text-lg">You Will Recieve {{ coinsToReceive }} {{ coinType }} coins</span>
						</div>
						<div class="actions">
							<button :disabled="transformedAssets.length === 0">Buy {{ coinType }}</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Authenticated, Global } from '../mixins/mixins';
import { numberWithCommas } from '../utils/Commaseparator';
import { getPrice } from '../utils/fetchCoins';
import { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperCore, SwiperSlide } from 'swiper-vue2';
import 'swiper/swiper-bundle.css';
import VueAxios from 'vue-axios';
let coinValue: number;
let newAssets: any = [];
declare module 'vue/types/vue' {
	interface Vue {
		http: typeof VueAxios;
	}
}
SwiperCore.use([Autoplay, Navigation]);

@Component({
	components: {
		Swiper,
		SwiperSlide
	}
})
export default class BuyAsset extends mixins(Global, Authenticated) {
	kshAmount: string;
	transformedAssets: any = [];
	transactionAmount = 0;
	coinsToReceive = 0.0;
	position = 0;
	coinPerfomance: any = [];
	finalPerfomanceData: any = [];
	walletPhoneNumber: string = this.$store.getters.walletPhoneNumber;
	rate: number;
	assets: any = [
		{
			id: 'bitcoin',
			symbol: 'BTC',
			name: 'Bitcoin',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404'
		},
		{
			id: 'ethereum',
			symbol: 'ETH',
			name: 'Ethereum',
			img: 'https://www.pngkey.com/png/full/264-2645294_download-svg-download-png-ethereum-png.png',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'
		},
		{
			id: 'usd-coin',
			symbol: 'USDC',
			name: 'Usdc',
			img: 'https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
			bal: '0.06594'
		},
		{
			id: 'binancecoin',
			symbol: 'BNB',
			name: 'Binance',
			img: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png',
			addr: '0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED'
		},
		{
			id: 'dai',
			symbol: 'DAI',
			name: 'Dai',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF'
		}
	];
	PRE_PAYMENT_CODE = '254';
	priceChange: any = [];
	coinType = this.assets[0].name;
	coinAddr = this.assets[0].addr;

	changeCoinAndUpdateCoinAddr(coin: string, addr: string) {
		this.coinType = coin;
		this.coinAddr = addr;
	}
	redirectUser() {
		this.$router.push('/').catch(() => undefined);
	}

	@Watch('kshAmount')
	handleWithdrawalAmountChange(newValue: number) {
		// perfome transaction fee actions
		// amount of coins user will receive actions
	}

	executeBuying() {
		if (!this.kshAmount) {
			this.$vToastify.error('amount field cannot be empty', 'EMPTY FIELD');
			this.hideSpinner();
			return;
		}
		/***  
		Validate amount paid
		send payment request
		confirm if payment is a success or fail(if fail route to fail page)
		if true execute next fuction(block chain transactions)
		**/
		const phonenumber = this.PRE_PAYMENT_CODE + this.walletPhoneNumber.substring(1);
		const amount = this.kshAmount;
		this.sendMpesaStkPush({ phonenumber, amount })
			.then(() => {
				//perfome next function(block chain transactions)
			})
			.catch(() => {
				// if payment fail route to failpage
			});
	}
	async mounted() {
		await this.$http
			.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false')
			.then(async (response) => {
				let ids = ['bitcoin', 'ethereum', 'dai', 'usd-coin', 'binancecoin'];
				let { data } = response;
				await data.map((coin: any) => {
					this.coinPerfomance.push({
						id: coin.id,
						change: coin.price_change_percentage_24h
					});
				});
				const coinPerfArray = JSON.parse(JSON.stringify(this.coinPerfomance));
				this.priceChange = coinPerfArray.filter((coin: { id: string }) => ids.includes(coin.id));
				const priceChangeObj = JSON.parse(JSON.stringify(this.priceChange));
				this.finalPerfomanceData = this.assets.map((el: { id: any }) => ({
					...el,
					change: priceChangeObj.find((pc: { id: any }) => pc.id === el.id)?.change
				}));
				newAssets = JSON.parse(JSON.stringify(this.finalPerfomanceData));
			})
			.catch((err) => {
				window.console.log(err);
			});

		let myHeaders = new Headers();
		myHeaders.append('apikey', 'xXHV07ckmqDKWbX2rbe3B42hZIerttDS');
		await fetch('https://api.apilayer.com/fixer/latest?symbols=KES&base=USD', { method: 'GET', redirect: 'follow', headers: myHeaders })
			.then((response) => response.text())
			.then((result) => {
				let kerate: any = JSON.parse(result);
				this.rate = kerate.rates?.KES.toFixed(2);
				window.console.log('rate', this.rate);
			});

		for (let i = 0; i < newAssets.length; i++) {
			coinValue = await getPrice(newAssets[i].addr);
			this.transformedAssets.push({
				id: newAssets[i].id,
				symbol: newAssets[i].symbol,
				name: newAssets[i].name,
				img: newAssets[i].img,
				addr: newAssets[i].addr,
				daychange: newAssets[i].change.toFixed(2),
				value: numberWithCommas(coinValue)
			});
		}
	}
}
</script>
<style scoped>
.figma {
	background: #fff;
	border-radius: 14px 14px 0 0;
	height: 65vh;
}
@media (max-width: 480px) {
	.figma {
		height: 56vh;
	}
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
.row__container {
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
	content: '';
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
</style>

6cf69c723da743ddbdd6ecefbb1d16e4