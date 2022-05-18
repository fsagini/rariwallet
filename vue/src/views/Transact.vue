<template>
	<div class="container">
		<h2 class="title">BUY CRYPTO CURRENCY</h2>
		<p data-cy="buyCryptoTitle" class="sub__title">Purchase Crypto Coins Through M-PESA</p>
		<div class="coinImage">
			<img :src="coinImage" alt="coinType" />
		</div>
		<div class="conversion">
			<span>1 {{ coinType }} = ${{ coinPrice }}</span>
			<span
				><h1>CONVERSION RATES</h1>
				<label class="label">$1 = KES {{ kesRates }}</label></span
			>
		</div>
		<div class="field">
			<div class="control">
				<input disabled type="text" class="input" name="coinType" v-model="coinType" @keypress="handleKeyPress" />
			</div>
		</div>

		<div class="field">
			<label class="label">Amount To Pay (Ksh)</label>
			<div class="control">
				<input data-cy="amountToPay" type="text" class="input" name="amountToPay" v-model="amountToPay" @keypress="handleKeyPress" />
			</div>
			<p v-if="amountError" class="value__error">Amount cannot be less than 500</p>
		</div>

		<div class="field">
			<label class="label">Total {{ coinType }} Coins you will Recieve</label>
			<div class="control">
				<input
					data-cy="amountToReceive"
					disabled
					type="text"
					class="input"
					name="amountToReceive"
					v-model="amountToReceive"
					@keypress="handleKeyPress"
				/>
			</div>
		</div>
		<div class="field">
			<label class="label">Transaction Fee</label>
			<div class="control">
				<input
					data-cy="transactionFee"
					disabled
					type="text"
					class="input"
					name="transactionFee"
					v-model="transactionFee"
					@keypress="handleKeyPress"
				/>
			</div>
		</div>

		<div class="error mt-3" v-if="logonError">
			<p>⚠️ <span data-cy="passwordError" v-html="logonError"></span></p>
		</div>

		<button
			data-cy="confirmAccessButton"
			@click="purchaseCrypto()"
			class="button  big-button is_login transition-faster"
			:disabled="!amountToPay"
		>
			<span class="text">BUY</span>
		</button>
		<button v-on:click="pageBack()" class="button is-ghost is-blue big-button medium-text transition-faster">
			<span class="text">{{ $t('common.BACK') }}</span>
		</button>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Authenticated } from '../mixins/mixins';
@Component({})
export default class Transact extends mixins(Authenticated) {
	walletPassword = '';
	amountToReceive = 0;
	amountToPay = 0;
	coinImage = this.$route.params.img;
	coinType = this.$route.params.id;
	kesRates = this.$route.params.keRate;
	logonError = '';
	coinPrice = this.$route.params.price;
	transactionFee = 50;
	amountError = false;
	coinsData: any = [];

	@Prop()
	error!: string;

	@Watch('error')
	handleErorrChange(newValue: string) {
		if (newValue) this.logonError = newValue;
	}

	purchaseCrypto() {
		// add logic to buy via mpesa
	}

	pageBack() {
		this.$router.push('/trade').catch(() => undefined);
	}

	handleKeyPress(e: any) {
		const key = e.which || e.charCode || e.keyCode || 0;
		if (key === 13) {
			this.purchaseCrypto();
		}
	}
}
</script>

<style scoped>
.title {
	font-weight: bold;
	margin-bottom: 0;
}
.sub__title {
	padding: 10px 5px 5px 10px;
	font-weight: bold;
	font-size: 17px;
}
.value__error {
	padding: 10px 10px;
	background: rgb(248, 246, 246);
	border-radius: 14px;
	color: #f00;
	font-size: 17px;
	margin-top: 5px;
}
.conversion span{
	font-weight: 700;
}
.coinImage img {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	object-fit: cover;
	background-size: contain;
}
</style>