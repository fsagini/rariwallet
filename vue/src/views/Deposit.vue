<template>
	<div>
		<div class="pt-0">
			<span @click="NavigateBack()" class="pb-6"><i class="fa-solid fa-circle-xmark"></i></span>
			<div
				v-if="transformedAssets.length !== 0"
				class="flex justify-center align-middle space-x-3 p-3 ml-3 overflow-x-scroll scroll-smooth scrollbar-hide"
			>
				<div v-for="asset in transformedAssets" class="crypto__asset" :key="asset.symbol">
					<img :src="asset.imgURL" :alt="asset.symbol" />
					<span>{{ asset.symbol }}</span>
					<p>${{ asset.value }}</p>
				</div>
			</div>
			<div v-else>
				<span>Assets Loading</span>
			</div>
		</div>
		<div class="figma">
			<div>
				<p class="text-black font-semibold text-xl pt-10">Buy Crypto Asset</p>
				<span class="py-6 text-lg font-serif font-semibold text-blue-500">1$ = {{ rate }}Ksh.</span>
				<div class="flex flex-row p-3 m-3" v-if="transformedAssets.length !== 0">
					<div class="px-4" v-for="coin in transformedAssets" :key="coin.symbol">
						<img
							class="h-10 rounded-full cursor-pointer hover:scale-105 transition transform duration-300 ease-out active:rounded-full"
							:src="coin.imgURL"
							:alt="coin.symbol"
							v-on:click="changeCoinAndUpdateCoinAddr(coin.symbol, coin.addr)"
						/>
					</div>
				</div>
				<div v-else>loading</div>
				<div class="m-4 py-4">
					<div class="py-4">
						<input class="w-30 px-4" type="text" v-model="coinType" disabled />
					</div>
					<div class="py-4 border-b-2 border-blue-500">
						<input
							class="w-30 px-4 outline-none border-none bg-inherit text-sm font-semibold"
							type="number"
							v-model="kshAmount"
							placeholder="Enter amount Ksh"
						/>
					</div>
					<div class="py-4 border-b-2 border-blue-500">
						<label class="text-lg font-serif font-semibold">Transaction Fee</label>
						<input
							class="w-30 px-4 outline-none border-none bg-inherit text-sm font-semibold"
							type="text"
							v-model="transactionAmount"
							disabled
						/>
					</div>
					<div class="py-4 border-b-2 border-blue-500">
						<label class="text-lg font-serif font-semibold"> Total {{ coinType }} Coins You Will Receive</label>
						<input class="w-30 px-4 outline-none border-none bg-inherit text-sm font-semibold" type="text" disabled />
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
import { Watch } from 'vue-property-decorator';
import { Authenticated, Global } from '../mixins/mixins';
import { numberWithCommas } from '../utils/Commaseparator';
import { getPrice } from '../utils/fetchCoins';
let coinValue: number;

@Component
export default class BuyAsset extends mixins(Global, Authenticated) {
	coinType = 'BTC';
	coinAddr: string;
	kshAmount: number;
	transformedAssets: any = [];
	transactionAmount = 0;
	position = 0;
	rate: number;
	assets: any = [
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
			name: 'USDC-COIN',
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
			name: 'DAI-COIN',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF'
		}
	];

	changeCoinAndUpdateCoinAddr(coin: string, addr: string) {
		this.coinType = coin;
		this.coinAddr = addr;
	}
	NavigateBack() {
		this.$router.push('/').catch(() => undefined);
	}

	async mounted() {
		var myHeaders = new Headers();
		myHeaders.append('apikey', 'xXHV07ckmqDKWbX2rbe3B42hZIerttDS');
		fetch('https://api.apilayer.com/fixer/latest?symbols=KES&base=USD', { method: 'GET', redirect: 'follow', headers: myHeaders })
			.then((response) => response.text())
			.then((result) => {
				var kerate: any = JSON.parse(result);
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
	font-weight: bold;
	display: flex;
	padding-top: 5px;
}
.crypto__asset p {
	color: #fff;
	font-size: 17px;
	font-weight: bold;
	padding-top: 5px;
	display: flex;
	padding-bottom: 50px;
	font-size: 19px;
}
.crypto__asset img {
	height: 30px;
	width: 30px;
	object-fit: cover;
}
.fa-circle-xmark {
	font-size: 40px;
	transform: translate(0%, -50%);
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
</style>