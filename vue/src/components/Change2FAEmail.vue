<template>
	<div class="">
		<div class="email__img">
			<img src="@/assets/img/email_verification.png" alt="Email 2FA image" />
		</div>
		<div class="white__container container">
			<h2 data-cy="emailConfirmationTitle" class="title mt-3">{{ $t('2fa.EMAIL_CONFIRMATION_TITLE') }}</h2>
			<p class="subtitle">{{ $t('2fa.EMAIL_CONFIRMATION_DESCRIPTION') }}</p>
			<div class="field">
				<div class="control__input">
					<input
						data-cy="2faEmailCode"
						type="number"
						:placeholder="$t('2fa.EMAIL_CODE')"
						inputmode="numeric"
						class="border-none bg-none outline-none p-2"
						v-model="authenticatorCode"
						min="0"
					/>
				</div>
			</div>
			<button
				data-cy="confirmButton"
				@click="setCode()"
				class="button is-green big-button is-login transition-faster mt-5"
				:disabled="!authenticatorCode"
			>
				<span class="text">{{ $t('common.SUBMIT') }}</span>
			</button>
			<button v-on:click="pageBack()" class="button is-ghost is-blue big-button medium-text transition-faster">
				<span class="text">{{ $t('common.CANCEL') }}</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Authenticated } from '../mixins/mixins';
import { verifyEmailCode } from '../utils/backupRestore';
import { getDictionaryValue } from '../utils/dictionary';

@Component({})
export default class Change2FAEmail extends mixins(Authenticated) {
	authenticatorCode = '';
	logonError = '';

	@Prop()
	error!: string;

	@Watch('error')
	handleErorrChange(newValue: string) {
		if (newValue) this.logonError = newValue;
	}

	@Emit('setCode')
	async setCode() {
		this.logonError = '';

		const isCodeValid = await this.confirmAuthenticator();
		if (isCodeValid) return this.authenticatorCode;
		else return null;
	}

	@Emit('pageBack')
	pageBack() {
		return;
	}

	async confirmAuthenticator() {
		const confirmCode = await verifyEmailCode(this.store.email, this.authenticatorCode);

		if (confirmCode.success) {
			this.logonError = '';
			return true;
		} else {
			this.logonError = getDictionaryValue(confirmCode.error);
			return false;
		}
	}
}
</script>
<style scoped>
.white__container {
	background: #fff;
	border-radius: 14px 14px 0 0;
	height: 41.9vh;
}
.email__img {
	margin-left: 50px;
	margin-bottom: 20px;
}
.email__img img {
	height: 180px;
	width: 180px;
	object-fit: cover;
}
.control__input {
	border-bottom: 2px solid #228cdb;
}
@media screen and(max-width: 480px ) {
	.white__container {
		height: 30.9vh;
	}
}
</style>
