<template>
	<div>
		<div class="flex flex-row justify-around text-white mb-20 cursor-pointer">
			<span @click="navigateBack()"><i class="fa-solid fa-angles-left"></i></span>
			<p class="text-2xl font-semibold font-serif">All Transactions</p>
			<span><i class="fa-solid fa-filter"></i></span>
		</div>
		<div class="figma">
			<div class="flex flex-row justify-around mb-5">
				<div class="bg_grey">
					<span class="font-serif">Transaction type <i class="fa-solid fa-angle-down"></i></span>
				</div>
				<div class="bg_grey">
					<span class="font-serif">Coins <i class="fa-solid fa-angle-down"></i></span>
				</div>
				<div class="bg_grey">
					<span class="font-serif">Select Date <i class="fa-solid fa-angle-down"></i></span>
				</div>
			</div>
			<div>
				<div v-for="transaction in walletTransactions" class="assets" :key="transaction.id">
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
						<p class="text-black font-serif font-semibold">$ {{ transaction.value }}</p>
						<p class="text-black font-serif">{{ transaction.coins }} {{ transaction.coinType }}</p>
					</div>
					<div class="asset__price">
						<span>{{ transaction.transactionType }}</span>
						<p>{{ transaction.date }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Authenticated, Global } from '../mixins/mixins';

export default class Transactions extends mixins(Global, Authenticated) {
	walletTransactions: any = [
		{
			id: 'tyu567885567',
			coins: 0.00987,
			transactionType: 'Withdrawn',
			coinType: 'BTC',
			addr: '0xECe365B379E1dD183B20fc5f022230C044d51404',
			date: 'Jan 24, 2022',
			value: 400
		},
		{
			id: '6778yuui8',
			coins: 0.02987,
			coinType: 'USDC',
			transactionType: 'Deposited',
			addr: '0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB',
			date: 'Aug 24, 2022',
			value: 500
		},
		{
			id: '45yjkkij7890',
			coins: 0.005887,
			coinType: 'ETH',
			transactionType: 'Withdrawn',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			date: 'Dec 24, 2022',
			value: 300
		},
		{
			id: '345fg678fghh',
			coins: 0.09987,
			coinType: 'ETH',
			transactionType: 'Sent',
			addr: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
			date: 'Dec 24, 2022',
			value: 678
		}
	];

	navigateBack() {
		this.$router.push('/').catch(() => undefined);
	}
}
</script>

<style scoped>
.fa-angles-left,
.fa-filter {
	font-size: 24px;
	line-height: 32px;
}
.figma {
	background: #fff;
	border-radius: 14px 14px 0 0;
	padding-top: 30px;
	height: 100%;
}
.bg_grey {
	padding: 8px 20px;
	background: rgb(238, 232, 232);
	border-radius: 20px;
	color: #000;
	cursor: pointer;
}
</style>
