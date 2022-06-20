<template>
	<div>
		<div class="pt-0">
			<div class="flex flex-row justify-around">
				<span @click="NavigateBack()" class=""><i class="fa-solid fa-angles-left"></i></span>
				<p class="text-white text-xl">Buy Crypto Asset</p>
			</div>
			<div v-if="transformedAssets.length !== 0" class="row__container">
				<div v-for="asset in transformedAssets" class="single__asset__price" :key="asset.symbol">
					<div class="asset__img">
						<img :src="asset.imgURL" :alt="asset.symbol" />
					</div>
					<div class="asset_name__price">
						<span>{{ asset.symbol }}</span>
						<p>${{ asset.value }}</p>
					</div>
				</div>
			</div>
			<div v-else>
				<span>Assets Loading</span>
			</div>
		</div>
		<div class="figma">
			<div>
				<span v-if="rate" class="py-6 text-lg text-blue-500 font-semibold">1$ = {{ rate }}Ksh</span>
				<span v-else class="text-blue-500 font-semibold">currency-exchange loading...</span>
				<div class="row__container">
					<div class="single__asset" v-for="asset in assets" :key="asset.addr">
						<div class="asset__img">
							<img :src="asset.img" alt="" />
						</div>
						<div class="asset_name">
							<span>{{ asset.name }}</span>
						</div>
					</div>
				</div>
				<div class="m-4 py-4">
					<!-- <div class="py-4 flex justify-center items-center">
						<input
							class="w-[70px] px-4 bg-none border-none outline-noneflex justify-center items-center"
							type="text"
							v-model="coinType"
							disabled
						/>
					</div> -->
					<div class="py-4 flex justify-center items-center">
						<input class="w-[150px] px-4 bg-none border-none outline-none" type="number" v-model="kshAmount" placeholder="0.00Ksh" />
					</div>
					<div class="py-4">
						<span>Transaction Fee {{ transactionAmount }} Ksh.</span>
					</div>
					<div class="py-4">
						<span>To Recieve {{ coinsToReceive }} {{ coinType }} coins</span>
					</div>
					<div class="actions">
						<button>Buy {{ coinType }}</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Authenticated, Global } from '../mixins/mixins';
import { numberWithCommas } from '../utils/Commaseparator';
import { getPrice } from '../utils/fetchCoins';
let coinValue: number;

@Component
export default class BuyAsset extends mixins(Global, Authenticated) {
	kshAmount: number;
	transformedAssets: any = [];
	transactionAmount = 0;
	coinsToReceive = 0.0;
	position = 0;
	rate: number;
	assets: any = [
		{
			symbol: 'BTC',
			name: 'Bitcoin',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404'
		},
		{
			symbol: 'ETH',
			name: 'Ethereum',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'
		},
		{
			symbol: 'USDC',
			name: 'Usdc',
			img: 'https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
			bal: '0.06594'
		},
		{
			symbol: 'BNB',
			name: 'Binance',
			img: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png',
			addr: '0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED'
		},
		{
			symbol: 'DAI',
			name: 'Dai',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF'
		}
	];
	coinType = this.assets[0].symbol;
	coinAddr = this.assets[0].addr;

	changeCoinAndUpdateCoinAddr(coin: string, addr: string) {
		this.coinType = coin;
		this.coinAddr = addr;
	}
	NavigateBack() {
		this.$router.push('/').catch(() => undefined);
	}

	async mounted() {
		let myHeaders = new Headers();
		myHeaders.append('apikey', 'xXHV07ckmqDKWbX2rbe3B42hZIerttDS');
		fetch('https://api.apilayer.com/fixer/latest?symbols=KES&base=USD', { method: 'GET', redirect: 'follow', headers: myHeaders })
			.then((response) => response.text())
			.then((result) => {
				let kerate: any = JSON.parse(result);
				this.rate = kerate.rates.KES.toFixed(2);
			})
			.catch((error) => console.log('error', error));

		for (let i = 0; i < this.assets.length; i++) {
			coinValue = await getPrice(this.assets[i].addr);
			this.transformedAssets.push({
				symbol: this.assets[i].symbol,
				name: this.assets[i].name,
				imgURL: this.assets[i].img,
				addr: this.assets[i].addr,
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
	height: 77%;
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
	height: 40px;
	width: 40px;
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
.row__container {
	display: flex;
	overflow-x: scroll;
}
.row__container::-webkit-scrollbar {
	display: none;
}
.asset__img {
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
}
.single__asset__price {
	display: flex;
	flex-direction: column;
	padding: 20px 40px;
	justify-content: space-between;
	background: #fff;
	margin: 10px;
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
</style>