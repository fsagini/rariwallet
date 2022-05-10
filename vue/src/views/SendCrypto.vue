<template>
	<div class="container">
		<h1 class="title">SEND CRYPTO COINS</h1>
		<div class="sub__title">
			<h1 class="title_disc">DISCLAIMER.</h1>
			<p>RARI shall not be liable in the event of coins sent to wrong address</p>
		</div>
		<div class="send__container">
			<form @submit.prevent="sendInApp">
				<div class="field">
					<label class="label">COIN TO SEND</label>
					<div class="control select">
						<select v-model="CoinToSend" required>
							<option v-for="wallet in Wallets" :key="wallet.name">{{ wallet.name }}</option>
						</select>
					</div>
				</div>
				<div class="field">
					<label class="label">FROM</label>
					<div class="control">
						<input data-cy="transactionFee" disabled type="text" class="input" name="Address" v-model="Address" />
					</div>
				</div>
				<div class="field">
					<label class="label">TO</label>
					<div class="control">
						<input data-cy="transactionFee" type="text" autocomplete="off" required class="input" name="AddressTO" v-model="AddressTO" />
					</div>
					<p v-if="addressError" class="value__error">The wallet addres is invalid</p>
				</div>
				<div class="field">
					<label class="label">AMOUNT OF COINS TO SEND</label>
					<div class="control">
						<input
							data-cy="coinsToSend"
							type="number"
							required
							step="any"
							class="input"
							name="coinsToSend"
							v-model="coinsToSend"
						/>
					</div>
				</div>
				<p v-if="balanceError" class="value__error">You do not have enough {{ CoinToSend }} coins to send. Try lower amount</p>
				<p v-if="amountError" class="value__error">The least amount of coins you can send is 0.00001</p>
				<div class="field">
					<label class="label">TRANSACTION FEE</label>
					<div class="control">
						<input data-cy="TransactionFee" disabled type="text" class="input" name="TransactionFee" v-model="TransactionFee" />
					</div>
				</div>
				<div class="action">
					<button class="send" type="submit">SEND</button>
				</div>
			</form>
			<div class="action_can">
				<button @click="pageBack" class="cancel">CANCEL</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Authenticated, Global } from '../mixins/mixins';
let WAValidator = require('multicoin-address-validator');

@Component
export default class SendCrypto extends mixins(Global, Authenticated) {
	Address = '';
	TransactionFee = 0;
	amountError = false;
	balanceError = false;
	addressError = false;
	AddressTO = '';
	coinsToSend = 0;
	CoinToSend = '';
	Wallets = [{ name: 'BTC' }, { name: 'BNB' }, { name: 'ETH' }, { name: 'DAI' }, { name: 'USDC' }];

	async mounted() {
		this.Address = this.store.accounts[0];
	}

	async sendInApp() {
		const valid = WAValidator.validate(this.AddressTO, this.CoinToSend);
		if (!valid) {
			this.addressError = true;
		} else {
			return (this.addressError = false);
		}
		// To be modiefied after perfoming blockchain transactions with balance and transaction fee accounted for
		if (this.coinsToSend < 0.00001) {
			this.amountError = true;
		} else {
			return (this.amountError = false);
		}
		// if (this.isIframe()) {
		// 	if (this.store.connection && this.store.connection !== null) {
		// 		const promise = this.store.connection.promise;
		// 		(await promise).openSendInApp();
		// 	}
		// }
	}
	pageBack() {
		this.$router.push('/').catch(() => undefined);
	}
}
</script>


<style scoped>
.title {
	font-weight: 700;
	font-size: 25px;
	color: #000;
}
.title_disc {
	color: #ed5135;
	font-weight: 600;
	font-size: 22px;
}
.select select {
	width: 200px;
}
.sub__title {
	font-size: 17px;
	background: #efefefad;
	padding: 10px 0;
	font-weight: 500;
	border-radius: 24px;
	color: rgb(37, 36, 36);
}

.send__container {
	display: block;
}
form {
	display: flex;
	flex-direction: column;
	padding: 10px 0;
}
.action {
	padding: 20px 10px;
	justify-content: center;
	align-content: center;
}

.value__error {
	padding: 10px 10px;
	background: rgb(248, 246, 246);
	border-radius: 14px;
	color: #f00;
	font-size: 17px;
	margin-top: 5px;
}
.select option {
	padding: 10px 5px;
}
.action button {
	padding: 20 45px;
	height: 40px;
	width: 200px;
	margin: 10px;
	border: none;
	border-radius: 20px;
	cursor: pointer;
}
.action_can button {
	height: 40px;
	width: 200px;
	margin: 10px;
	border: none;
	border-radius: 20px;
	padding: 20 45px;
	cursor: pointer;
}
.send {
	background: #5aaf51;
	color: #fff;
	font-size: 17px;
	font-weight: 700;
}
.cancel {
	background: #ed5135;
	color: #fff;
	font-size: 17px;
	font-weight: 700;
}

input[type='radio'] {
	height: 20px;
	width: 20px;
	top: -12px;
	margin-left: 10px;
}
.control__radio {
	padding: 0 5px;
}

.coins {
	display: flex;
	justify-content: center;
	flex-direction: column;
	position: relative;
	padding: 0 10px;
}
</style>