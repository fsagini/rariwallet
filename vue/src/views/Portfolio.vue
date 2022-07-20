<template>
	<div>
		<div @click="navigateMenu()" class="menu__slide flex flex-row justify-between pl-5 pr-10 mb-5">
			<div @click="buyAsset()" class="wallet__menu">BUY</div>
			<div @click="sellAsset()" class="wallet__menu">SELL</div>
			<div @click="sendAsset()" class="wallet__menu">SEND</div>
			<div @click="profilePage()" class="wallet__menu">PROFILE</div>
		</div>
		<div class="portfolio__header">
			<div class="portfolio__title">
				<div class="ml-3">
					<p class="medium-text has-text-weight-medium">
						<span class="important-font">Wallet Addres - {{ formatEthAddress(accounts[0]) }} </span>
						<span class="copy-icon" @click="copyETHAddress(accounts[0])"><i class="fas fa-copy" /></span>
					</p>
				</div>
			</div>
		</div>
		<div class="portfolio__wallet">
			<span v-if="walletBalance"> $ {{ walletBalance }}</span>
			<span v-else> $balance...</span>
			<p>Wallet Balance</p>
		</div>
		<div class="figma">
			<span class="container__title">Assets</span>

			<!-- Assets Beggining -->
			<div v-if="transformedWalletAssets.length === 0">
				<p>Assets loading....</p>
			</div>
			<div v-else-if="transformedWalletAssets.length !== 0">
				<div v-if="ShowAll === false">
					<div v-for="asset in transformedWalletAssets.slice(0, 2)" class="assets" :key="asset.addr">
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
								{{ asset.daychange > 0 ? '+' + asset.daychange : asset.daychange }}%
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
								{{ asset.daychange > 0 ? '+' + asset.daychange : asset.daychange }}%
							</p>
						</div>
					</div>
				</div>
				<div class="actions">
					<button v-on:click="navigatePath()">{{ $t('common.Deposit') }}</button>
				</div>
				<span @click="toggleShowAll" class="view__assets">
					<p v-if="!ShowAll">
						{{ $t('common.SEE_ASSETS') }}
					</p>
					<p v-if="ShowAll">
						{{ $t('common.HIDE_ASSETS') }}
					</p>
				</span>
			</div>
			<div v-else>
				<p>You have no assets at the momment!!</p>
			</div>
			<span class="container__title"> Latest Transactions </span>

			<!-- Transactions Beggining -->
			<div>
				<div v-if="transformedWalletTransactions.length === 0">
					<p>Transactions loading...</p>
				</div>
				<div v-else-if="transformedWalletTransactions !== 0">
					<!-- Show only two Transactions -->
					<div v-for="transaction in transformedWalletTransactions.slice(0, 2)" class="assets" :key="transaction.id">
						<div class="transaction__avatar">
							<span class="deposited" v-if="transaction.transactionType === 'Deposited'">
								<i class="fa-solid fa-arrow-right-from-bracket"></i>
							</span>
							<span class="withdraw" v-else-if="transaction.transactionType === 'Withdrawn'">
								<i class="fa-solid fa-arrow-down"></i>
							</span>
							<span class="sent" v-else-if="transaction.transactionType === 'Sent'">
								<i class="fa-solid fa-money-bill-transfer"></i>
							</span>
						</div>
						<div class="balance__details">
							<span>$ {{ transaction.value }}</span>
							<p>{{ transaction.coins }} {{ transaction.coinType }}</p>
						</div>
						<div class="asset__price">
							<span>{{ transaction.transactionType }}</span>
							<p>{{ transaction.date }}</p>
						</div>
					</div>
					<span @click="transactionsPage()" class="view__assets">
						<p>
							{{ $t('common.SEE_TRANSACTIONS') }}
						</p>
					</span>
				</div>
				<div v-else>
					<p>No Transactions at the moment</p>
				</div>
			</div>
			<div class="bottom__menu">
				<div class="bottom__icons">
					<span @click="transactionsPage()"
						><i class="fa-solid fa-arrow-right-arrow-left"> </i>
						<p class="font-semibold text-sm">Transactions</p></span
					>
					<span @click="buyAsset()" class="bottom__deposit"><i class="fa-solid fa-plus"></i></span>
					<span @click="logout()"
						><i class="fa-solid fa-cube"></i>
						<p class="font-semibold text-sm">Sign-out</p></span
					>
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
import jazzicon from '@metamask/jazzicon';
import { copyToClipboard } from '../utils/utils';
let value: string | number;
let newAssets: any = [];
let transacValue: number;

@Component
export default class Portfolio extends mixins(Global, Authenticated) {
	walletBalance: number | string;
	totalValue: number;
	dropdownIsActive = false;
	selectedAccount = '';
	noRecoveryMethods = false;
	twoFactorActive = false;
	twoFactorEmailActive = false;
	whatRecovery = {
		facebook: false,
		google: false,
		vkontakte: false
	};
	ShowAll = false;
	menuShowing = false;
	coinPerfomance: any = [];
	finalPerfomanceData: any = [];
	priceChange: any = [];
	walletTransactions: any = [
		{
			id: 1,
			coins: 0.00987,
			transactionType: 'Withdrawn',
			coinType: 'BTC',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404',
			date: 'Jan 24, 2022'
		},
		{
			id: 2,
			coins: 0.02987,
			coinType: 'USDC',
			transactionType: 'Deposited',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
			date: 'May 04, 2022'
		},
		{
			id: 3,
			coins: 0.005887,
			coinType: 'ETH',
			transactionType: 'Withdrawn',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			date: 'July 24, 2022'
		},
		{
			id: 4,
			coins: 0.09987,
			coinType: 'ETH',
			transactionType: 'Sent',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			date: 'July 26, 2022'
		}
	];
	transformedWalletAssets: any = [];
	transformedWalletTransactions: any = [];
	walletAssets: any = [
		{
			id: 'bitcoin',
			symbol: 'BTC',
			name: 'Bitcoin',
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
			bal: 0.10994,
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404'
		},
		{
			id: 'ethereum',
			symbol: 'ETH',
			name: 'Ethereum',
			img: 'https://www.pngkey.com/png/full/264-2645294_download-svg-download-png-ethereum-png.png',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			bal: 0.1976994
		},
		{
			id: 'usd-coin',
			symbol: 'USDC',
			name: 'Usdc-Coin',
			img: 'https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
			bal: 0.06594
		},
		{
			id: 'binancecoin',
			symbol: 'BNB',
			name: 'Binance',
			img: 'https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png',
			addr: '0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED',
			bal: 0.06594
		},
		{
			id: 'dai',
			symbol: 'DAI',
			name: 'Dai',
			img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
			addr: '0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF',
			bal: 2
		}
	];
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
		ref.innerHTML = '';
		if (!ethAddress) {
			return;
		}
		const seed = parseInt(ethAddress.slice(2, 10), 16);
		if (!seed) return;
		const image = jazzicon(32, seed);
		ref.append(image);
	}
	// Wallet Menu Routes
	buyAsset() {
		this.router.push('/buy/asset').catch(() => undefined);
	}
	sellAsset() {
		this.router.push('/withdraw/asset').catch(() => undefined);
	}
	sendAsset() {
		this.router.push('/send/asset').catch(() => undefined);
	}
	transactionsPage() {
		this.router.push('/your/transactions').catch(() => undefined);
	}
	profilePage() {
		this.router.push('/settings').catch(() => undefined);
	}
	// End Wallet
	navigatePath() {
		this.router.push('/buy/asset').catch(() => undefined);
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
		const facebook = await this.hasRecovery(2);
		const google = await this.hasRecovery(3);
		const vkontakte = await this.hasRecovery(5);

		this.whatRecovery = {
			facebook,
			google,
			vkontakte
		};

		this.store.loginComplete = true;
		// Transform Assets

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
				this.finalPerfomanceData = this.walletAssets.map((el: { id: any }) => ({
					...el,
					change: priceChangeObj.find((pc: { id: any }) => pc.id === el.id)?.change
				}));
				newAssets = JSON.parse(JSON.stringify(this.finalPerfomanceData));
			})
			.catch((err) => {
				window.console.log(err);
			});

		for (let i = 0; i < newAssets.length; i++) {
			value = (await getPrice(newAssets[i].addr)) * newAssets[i].bal;
			this.transformedWalletAssets.push({
				symbol: newAssets[i].symbol,
				addr: newAssets[i].addr,
				name: newAssets[i].name,
				img: newAssets[i].img,
				bal: newAssets[i].bal,
				daychange: newAssets[i].change.toFixed(3),
				value: Math.round(value * 1e2) / 1e2
			});
		}

		this.totalValue = this.transformedWalletAssets.reduce((acc: number, curr: any) => {
			return acc + curr.value;
		}, 0);
		this.walletBalance = numberWithCommas(Math.round(this.totalValue * 1e2) / 1e2);

		// Transform Transactions

		for (let i = 0; i < this.walletTransactions.length; i++) {
			transacValue = (await getPrice(this.walletTransactions[i].addr)) * this.walletTransactions[i].coins;
			this.transformedWalletTransactions.push({
				id: this.walletTransactions[i].id,
				date: this.walletTransactions[i].date,
				coins: this.walletTransactions[i].coins,
				value: numberWithCommas(Math.round(transacValue * 1e2) / 1e2),
				coinType: this.walletTransactions[i].coinType,
				transactionType: this.walletTransactions[i].transactionType
			});
		}
	}
}
</script>
<style>
.loss {
	color: #f00;
	font-size: 12px !important;
}
.profit {
	color: #438102;
	font-size: 12px !important;
}
.wallet__menu {
	padding: 10px 20px;
	background: #fff;
	margin: 5px;
	border-radius: 20px;
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	scale: -100;
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
	justify-content: space-around;
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
