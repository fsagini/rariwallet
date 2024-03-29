<template>
	<div class="container">
		<h2 class="title text-white">{{ $t('2fa.CHANGE_AUTH_TITLE') }}</h2>
		<p class="subtitle">{{ $t('2fa.CHANGE_AUTH_DESCRIPTION') }}</p>

		<div class="">
			<figure class="image" v-if="qrCode">
				<img v-bind:src="qrCode" :alt="$t('2fa.QR_CODE')" />
			</figure>
		</div>
		<p class="is-size-7 mt-2 transition-faster text-black pt-10 text-xl">
			{{ $t('2fa.NEED_AUTHENTICATOR_HELP') }}
			<a href="https://authy.com/download/" target="_blank" class="text-white">Authy</a> {{ $t('2fa.NEED_AUTHENTICATOR_OR') }}
			<a
				href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
				target="_blank"
				class="text-white"
				>Google Authenticator</a
			>.
		</p>

		<div class="field">
			<div class="control">
				<input
					data-cy="2faAuthenticatorCode"
					type="number"
					inputmode="numeric"
					class="input bg-none outline-none border-none text-lg font-semibold"
					v-model="authenticatorCode"
					:placeholder="$t('2fa.VERIFICATION_CODE')"
					min="0"
				/>
			</div>
		</div>

		<div class="error mt-3" v-if="logonError">
			<p>⚠️ <span data-cy="2faAuthenticatorError" v-html="logonError"></span></p>
		</div>

		<button
			data-cy="confirm2faButton"
			@click="setCode()"
			class="button is-blue big-button is-login transition-faster mt-5"
			:disabled="!authenticatorCode"
		>
			<span class="text">{{ $t('common.CONFIRM') }}</span>
		</button>
		<button v-on:click="pageBack()" class="button is-ghost is-blue big-button medium-text transition-faster">
			<span class="text text-white tex-2xl">{{ $t('common.BACK') }}</span>
		</button>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { Authenticated } from '../mixins/mixins';
import { verifyAuthenticatorCode } from '../utils/backupRestore';
import { getDictionaryValue } from '../utils/dictionary';

@Component({})
export default class ChangeAuthenticator extends mixins(Authenticated) {
	authenticatorCode = '';
	logonError = '';

	@Prop()
	qrCode!: string;

	@Emit('setCode')
	async setCode() {
		const isCodeValid = await this.confirmAuthenticator();
		if (isCodeValid) return this.authenticatorCode;
		else return null;
	}

	@Emit('pageBack')
	pageBack() {
		return;
	}

	async confirmAuthenticator() {
		const confirmCode = await verifyAuthenticatorCode(this.store.email, this.authenticatorCode);

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

<style lang="scss" scoped>
.image {
	img {
		width: 140px;
		height: 140px;
		margin: -10px auto;
	}
}
</style>
