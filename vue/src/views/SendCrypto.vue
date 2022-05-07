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
                    <p v-if="addressError" class="value__error"> The address above is not correct. An address should be x hexadecimal characters</p>
				</div>
				<div class="field">
					<label class="label">COIN TO SEND</label>
					<div class="control select">
						<select v-model="CoinToSend" required>
							<option value="BTC">BTC</option>
						</select>
					</div>
				</div>
				<div class="field">
					<label class="label">VALUE OF COINS TO SEND</label>
					<div class="control">
						<input data-cy="coinsToSend" type="text" required class="input" name="coinsToSend" v-model="coinsToSend" />
					</div>
				</div>
				<p v-if="amountError" class="value__error"> You do not have enough {{}} coins to send. Try lower amount</p>
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


@Component
export default class SendCrypto extends mixins(Global, Authenticated) {

    // All these vars are hard coded just for design purpose but in future I will make them dynamic
	currencyType = 'KSh';
	Address = '0x8730ec898adf610c39d4ff90394a7216e9c0a7dd';
	TransactionFee = `20.12 ${this.currencyType}`;
    amountError=true;
    addressError=true;
    AddressTO ='';
    coinsToSend= 0.00000456;
    CoinToSend='';


	async sendInApp() {
		if (this.isIframe()) {
			if (this.store.connection && this.store.connection !== null) {
				const promise = this.store.connection.promise;
				(await promise).openSendInApp();
			}
		}
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

.value__error{
    padding: 10px 10px;
    background: rgb(248, 246, 246);
    border-radius:14px;
    color:#f00;
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