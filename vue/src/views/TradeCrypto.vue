<template>
	<div class="container">
		<h2 class="title">Buy Crypto With MPesa</h2>
		<p data-cy="buyCryptoTitle" class="subtitle">List of supported crypto coins</p>
		<div class="list-view" v-for="coin in coins" :key="coin.symbol">
			<router-link :to="{ name: 'Transact', params: { id: coin.symbol, addr: coin.addr } }">
				<div data-cy="coinsData" key="coinsData" class="coins-data is-flex">
					<div class="text link">{{ coin.symbol }}</div>
					<div class="text link">{{ coin.price }}</div>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { get } from 'js-cookie';
import Component, { mixins } from 'vue-class-component';
import { Global, Authenticated } from '../mixins/mixins';
import { getPrice } from '../utils/fetchCoins';

@Component
export default class TradeCrypto extends mixins(Global, Authenticated) {
	coins: any = [];
	addresses: any = [
		{
			symbol: 'BTC',
			name: 'BITCOIN',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png',
			addr: '0x8b935052f7C2Ef9D91840b1902B66610466B0a80'
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
		for (let i = 0; i < this.addresses.length; i++) {
			//value = await getPrice(addresses[i].addr);
			this.coins.push({
				symbol: this.addresses[i].symbol,
				addr: this.addresses[i].addr,
				price: 100,
				imgURL: this.addresses[i].img,
				title: this.addresses[i].name
			});
		}
		console.log('coins : ', this.coins);
		console.log('price', getPrice(this.coins.addr));
	}
	viewCoin() {
		console.log('coin-symbol', this.coins.symbol);
		this.router.push(`/trade/buy/${this.coins.symbol}`).catch(() => undefined);
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

.link {
	color: #000;
}
.image_coin {
	height: 50px;
	width: 50px;
}
</style>
