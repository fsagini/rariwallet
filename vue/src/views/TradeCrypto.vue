<template>
	<div class="container">
		<h2 class="title">BUY CRYPTO WITH M-PESA</h2>
		<p data-cy="buyCryptoTitle" class="subtitle">Supported Crypto Coins with Real-Time Market Price</p>
		<button class="back__button" @click="NavigateBack">BACK</button>
		<div v-if="coins.length !== 0">
			<div class="list-view" v-for="coin in coins" :key="coin.symbol">
				<router-link :to="{ name: 'Transact', params: { id: coin.symbol, addr: coin.addr, img:coin.imgURL, keRate:coin.keRate } }">
					<div data-cy="coinsData" key="coinsData" class="coins-data">
						<div class="text link">
							<span class="title">{{ coin.symbol }}</span>
							<div class="coin__img">
								<img :src="coin.imgURL" :alt="coin.symbol" />
							</div>
						</div>
						<div class="price">
							<span
								>Market Price:
								<p>${{ coin.price }}</p></span
							>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<div v-else class="coins__loading">
			<p>Coins Loading....</p>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Global, Authenticated } from '../mixins/mixins';

import { getPrice } from '../utils/fetchCoins';
let value: number;

@Component
export default class TradeCrypto extends mixins(Global, Authenticated) {
	rate: any
	coins: any = [];
	addresses: any = [
		{
			symbol: 'BTC',
			name: 'BITCOIN',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404'
		},
		{
			symbol: 'ETH',
			name: 'ETHEREUM',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'
		},
		{
			symbol: 'USDC',
			name: 'USDC STABLECOIN',
			img: 'https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB'
		},
		{
			symbol: 'BNB',
			name: 'BINANCE',
			img: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png',
			addr: '0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED'
		},
		{
			symbol: 'DAI',
			name: 'DAI STABLECOIN',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF'
		}
	];

	async mounted() {
		var myHeaders = new Headers();
	    myHeaders.append("apikey", "xXHV07ckmqDKWbX2rbe3B42hZIerttDS");
		fetch("https://api.apilayer.com/fixer/latest?symbols=KES&base=USD",{ method: 'GET', redirect: 'follow', headers: myHeaders }) .then(response => response.text()) 
		.then(result => {
			var kerate:any =JSON.parse(result) 
			this.rate=kerate.rates.KES}) 
		.catch(error => console.log('error', error));
		for (let i = 0; i < this.addresses.length; i++) {
			value = await getPrice(this.addresses[i].addr);
			this.coins.push({
				symbol: this.addresses[i].symbol,
				addr: this.addresses[i].addr,
				imgURL: this.addresses[i].img,
				price: value,
				title: this.addresses[i].name,
				keRate:this.rate,
			});
		}
		console.log('coins : ', this.coins);

	}

	NavigateBack() {
		this.$router.push('/').catch(() => undefined);
	}
	// fetchCoins().then(() => this.loading = false);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.coins-data {
	font-size: 1.1rem;
	justify-content: space-between;
	cursor: pointer;
	padding: 15px;
}

.title {
	font-family: sans-serif;
	font-weight: 800;
	font-size: 20px;
}

.link {
	color: #000;
	display: flex;
	justify-content: space-between;
}

.coin__img {
	padding: 10px 20px;
	display: flex;
}
.coin__img img {
	width: 70px;
	height: 70px;
	margin-right: 20px;
	border-radius: 50%;
	margin-left: 30px;
}
.subtitle {
	padding: 5px 5px 5px 5px;
	font-size: 18px;
	border-radius: 20px;
}

.coins__loading {
	display: flex;
	justify-content: center;
	align-content: center;
	margin-top: 50px;
}

.price > span {
	display: flex;
	color: #000;
	font-weight: 600;
}
.back__button {
	padding: 10px 40px;
	color: #fff;
	background: #000;
	border: none;
	border-radius: 24px;
	cursor: pointer;
}
.price p {
	padding: 0 10px;
	font-size: 19px;
	font-weight: bold;
	color: #67cb8a;
}
</style>