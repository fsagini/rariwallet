<template>
	<div>
		<div class="flex flex-row">
			<button @click="pageBack()" tag="button" class="back-menu">
				<i class="fa-solid fa-angles-left" />
			</button>
		</div>
		<img src="@/assets/img/security.svg" :alt="$t('images.PASSWORD_IMAGE')" class="confirm__img" />
		<div class="white__container">
			<h2 class="text-black text-xl font-semibold mt-5">{{ $t('confirm.CONFIRM_ACCESS_TITLE') }}</h2>
			<p data-cy="confirmAccessTitle" class="text-sm text-black pl-5 pr-5">{{ $t('confirm.CONFIRM_ACCESS_DESCRIPTION') }}</p>

			<div class="field pl-5 pr-5">
				<div class="bottom_control pl-1 pr-1">
					<input
						data-cy="confirmAccessPassword"
						type="password"
						class="border-none bg-none outline-none pl-2 font-semibold text-xl"
						name="walletPassword"
						v-model="walletPassword"
						@keypress="handleKeyPress"
						:placeholder="$t('common.PASSWORD')"
					/>
				</div>
			</div>
			<button data-cy="confirmAccessButton" @click="setPassword()" class="pl-5 pr-5 action" :disabled="!walletPassword">
				<span class="text">{{ $t('common.CONTINUE') }}</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { Authenticated } from '../mixins/mixins';
import { sha256 } from '../utils/cryptoFunctions';

@Component({})
export default class ConfirmAccess extends mixins(Authenticated) {
	walletPassword = '';
	logonError = '';

	@Prop()
	error!: string;

	@Watch('error')
	handleErorrChange(newValue: string) {
		if (newValue) this.logonError = newValue;
	}

	@Emit('setPassword')
	async setPassword() {
		const newPassword = await sha256(this.walletPassword);

		if (this.store.hashedPassword !== newPassword) {
			this.logonError = this.$t('errors.WRONG_PASSWORD').toString();
			this.$vToastify.error(`⚠️ ${this.logonError}`, 'PASSWORD ERROR');
			return null;
		}

		return newPassword;
	}
	@Emit('pageBack')
	pageBack() {
		return;
	}

	handleKeyPress(e: any) {
		const key = e.which || e.charCode || e.keyCode || 0;

		if (key === 13) {
			this.setPassword();
		}
	}
}
</script>

<style scoped>
.white__container {
	background: #fff;
	border-radius: 14px 14px 0 0;
	height: 28.2vh;
}
.action {
	padding: 15px 20px;
	background: #228cdb;
	width: 290px;
	border-radius: 24px;
	cursor: pointer;
	color: #fff;
	font-size: 17px;
	font-weight: 600;
	margin-bottom: 15px;
}
.fa-angles-left {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 25px;
	color: #fff;
	margin-left: 10px;
	cursor: pointer;
}
.back-menu {
	display: flex;
	margin-left: 20px;
	padding: 10px 2px;
	border: 1px solid #fff;
	width: 50px;
	cursor: pointer;
}
.bottom_control {
	border-bottom: 3px solid #228cdb;
	padding: 8px 0;
	padding-left: 5px;
	padding-right: 5px;
}
.confirm__img {
	padding-left: 25px;
	padding-right: 25px;
}
</style>