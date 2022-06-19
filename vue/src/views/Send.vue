<template>
	<div>
		<span class="pb-6" @click="NavigateBack()"><i class="fa-solid fa-circle-xmark"></i></span>
		<p class="text-3xl font-bold text-yellow-50 mb-10">Transfer Crypto</p>
		<div class="figma">
			<div class="row__container">
				<div class="single__asset" v-for="asset in walletAssets" :key="asset.addr">
					<div class="asset__img">
						<img :src="asset.img" alt="" />
					</div>
					<div class="asset_name">
						<span>{{ asset.name }}</span>
					</div>
				</div>
			</div>
			<p class="mt-5 text-md text-black-300">{{ coinBallance }} {{ coinType }} Available</p>
			<form class="flex justify-center flex-col align-middle">
				<div class="w-60 py-4 ml-10">
					<input type="text" class="px-4 border-none cursor-text outline-none t text-sm bg-none" placeholder="0.00BTC" />
				</div>
				<div class="w-60 py-4 ml-10">
					<input type="text" placeholder="Wallet Address Sending To" class="px-4 outline-none text-sm bg-none cursor-text border-none" />
				</div>
				<div class="w-60 py-4 ml-10">
					<span class="px-4 outline-none bg-none border-none text-lg text-grey"> Transaction Fee: {{ transactionAmount }} </span>
				</div>

				<div class="mt-5 mb-5">
					<button class="w_button">Transfer {{ coinType }}</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Authenticated, Global } from '../mixins/mixins';

export default class Withdraw extends mixins(Global, Authenticated) {
	walletAssets: any = [
		{
			symbol: 'BTC',
			name: 'Bitcoin',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
			bal: '0.10994',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404'
		},
		{
			symbol: 'ETH',
			name: 'Ethereum',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			bal: '0.1976994'
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
			addr: '0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED',
			bal: '0.06594'
		},
		{
			symbol: 'DAI',
			name: 'Dai',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF',
			bal: '2'
		}
	];
	coinBallance = this.walletAssets[1].bal;
	coinType = this.walletAssets[1].symbol;

	updateBallance(bal: string, coin: string) {
		this.coinBallance = bal;
		this.coinType = coin;
	}
	NavigateBack() {
		this.$router.push('/').catch(() => undefined);
	}
}
</script>

<style scoped>
.fa-circle-xmark {
	font-size: 40px;
	transform: translate(0%, -50%);
	color: #fff;
	outline: white;
	cursor: pointer;
}
.figma {
	background: #fff;
	border-radius: 14px 14px 0px 0px;
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
.asset__img img {
	width: 30px;
	height: 30px;
	object-fit: cover;
}
.asset_name span {
	flex: 1;
	margin-left: 15px;
	margin-top: 10px;
	font-size: 17px;
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
.w_button {
	padding: 10px 60px;
	background: #228cdb;
	outline: none;
	border-radius: 20px;
	color: #fff;
	font-size: 20px;
}
</style>


