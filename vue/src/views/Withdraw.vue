<template>
	<div>
		<span class="pb-6" @click="NavigateBack()"><i class="fa-solid fa-circle-xmark"></i></span>
		<p class="text-3xl font-bold text-yellow-50 mb-10">Sell Asset</p>
		<div class="figma">
			<p class="text-lg font-semibold">Your Wallet Assets</p>
			<div class="row__container">
				<div
					class="single__asset"
					v-for="asset in walletAssets"
					:key="asset.addr"
					@click="updateBallance(asset.bal, asset.symbol, asset.addr)"
				>
					<div class="asset__img">
						<img :src="asset.img" alt="" />
					</div>
					<div class="asset_name">
						<span>{{ asset.symbol }}</span>
					</div>
				</div>
			</div>
			<p class="mt-2 text-lg text-black-500">{{ coinBallance }} {{ coinType }} Available</p>
			<form @submit.prevent="executeWithdrawal()" class="flex justify-center flex-col cursor-text align-middle">
				<div class="w-60 py-4 ml-10">
					<input
						type="text"
						class="px-4 outline-none bg-none border-none text-sm"
						placeholder="0.00"
						v-model.number="withdrawalAmount"
						step=".00000001"
					/>
				</div>
				<div class="w-60 py-4 ml-10">
					<span type="text" disabled class="px-4 text-md text-gray-500">You Will Receive {{ totalAmountKsh }} Ksh</span>
				</div>
				<div class="w-60 py-4 ml-10">
					<span class="px-4 text-md text-gray-500">Transaction Fee {{ transactionAmount }} Ksh</span>
				</div>
				<div class="mt-5 mb-5">
					<button type="submit" class="w_button">Sell {{ coinType }} Asset</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Authenticated, Global } from '../mixins/mixins';
import VueToastify from 'vue-toastify';
declare module 'vue/types/vue' {
	interface Vue {
		$vToastify: typeof VueToastify;
	}
}
export default class Withdraw extends mixins(Global, Authenticated) {
	totalAmountKsh = 0;
	transactionAmount = 0;
	withdrawalAmount: number;
	coinAddress = '';
	walletAssets: any = [
		{
			symbol: 'BTC',
			name: 'BITCOIN',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404',
			bal: 0.10994
		},
		{
			symbol: 'ETH',
			name: 'ETHEREUM',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/628px-Ethereum_logo_2014.svg.png',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			bal: 0.1976994
		},
		{
			symbol: 'USDC',
			name: 'USDC',
			img: 'https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
			bal: 0.06594
		},
		{
			symbol: 'BNB',
			name: 'BINANCE',
			img: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png',
			addr: '0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED',
			bal: 0.06594
		},
		{
			symbol: 'DAI',
			name: 'DAI',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF',
			bal: 2
		}
	];

	coinBallance = this.walletAssets[0].bal;
	coinType = this.walletAssets[0].symbol;

	updateBallance(bal: number, symbol: string, addr: string) {
		this.coinBallance = bal;
		this.coinType = symbol;
		this.coinAddress = addr;
	}
	NavigateBack() {
		this.$router.push('/').catch(() => undefined);
	}

	@Watch('withdrawalAmount')
	handleWithdrawalAmountChange(newValue: number) {
		// perfome transaction fee actions
		// amount user will receive actions
	}
	executeWithdrawal() {
		if (!this.withdrawalAmount) {
			this.$vToastify.error('amount field cannot be empty', 'EMPTY FIELD');
			this.hideSpinner();
			return;
		}
		if (this.withdrawalAmount > this.coinBallance) {
			this.$vToastify.error(`You do not have enough ${this.coinType} coins to complete this transaction`, 'WALLET ERROR');
			this.hideSpinner();
			return;
		}
		this.showSpinner('performing blockchain transactions...');
		// performe withdrawal functions
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
.error_msg {
	font-family: serif;
	font-style: italic;
	color: #f00;
	font-size: 17px;
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
	font-size: 19px;
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
.figma {
	background: #fff;
	border-radius: 14px 14px 0px 0px;
}
.w_button {
	padding: 10px 60px;
	background: #228cdb;
	outline: none;
	border-radius: 20px;
	color: #fff;
	font-size: 20px;
	font-family: sans-serif;
	font-weight: 600;
}
</style>


