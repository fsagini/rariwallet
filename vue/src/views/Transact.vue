<template>
	<div class="container">
		<h2 class="title">Buy Crypto</h2>
		<p data-cy="buyCryptoTitle" class="subtitle">Purchase crypto via mpesa</p>

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
		</div>

		<div class="field">
			<label class="label">Total amount of {{ coinType }} you will Recieve</label>
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

		<div class="error mt-3" v-if="logonError">
			<p>⚠️ <span data-cy="passwordError" v-html="logonError"></span></p>
		</div>

		<button
			data-cy="confirmAccessButton"
			@click="purchaseCrypto()"
			class="button is-green big-button is-login transition-faster mt-5"
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
	coinType = this.$route.params.id;
	logonError = '';

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
