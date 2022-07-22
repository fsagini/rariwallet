<template>
	<div>
		<div>
			<div>
				<div class="card-content">
					<div class="content">
						<div class="push__down mb-20"></div>
						<div class="field">
							<div class="border-b-2 border-y-black">
								<input
									data-cy="newEmail"
									class="bg-none outline-none border-none p-2 text-lg"
									name="newEmail"
									type="email"
									v-model="newEmail"
									:placeholder="$t('common.NEW_EMAIL')"
								/>
							</div>
						</div>
						<div class="field">
							<div class="border-b-2 border-y-black">
								<input
									data-cy="confirmPassword"
									type="password"
									class="bg-none outline-none border-none p-2 text-lg"
									name="password"
									v-model="password"
									:placeholder="$t('common.PASSWORD')"
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="error mt-3" v-if="logonError">
					<p>⚠️ <span v-html="logonError"></span></p>
				</div>

				<div class="mt-5">
					<button
						class="button__update"
						data-cy="updateEmailButton"
						:disabled="!newEmail || !password"
						@click="
							setNewData({
								email: newEmail,
								password: password
							})
						"
					>
						<span class="text confirm-button">{{ $t('common.UPDATE_EMAIL') }}</span>
					</button>
					<button
						v-on:click="$router.push('/settings?email_password=true').catch(() => undefined)"
						tag="button"
						class="button is-ghost is-blue big-button medium-text transition-faster"
					>
						<span class="text-black fontweight-semibold">{{ $t('common.CANCEL') }}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { validateInput } from '../utils/backupRestore';
import { sha256 } from '../utils/cryptoFunctions';

import Component, { mixins } from 'vue-class-component';
import { Authenticated, Global } from '../mixins/mixins';
import { Emit, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class ChangeEmail extends mixins(Global, Authenticated) {
	newEmail = '';
	password = '';
	logonError = '';

	@Prop()
	error!: string;

	@Watch('error')
	handleErorrChange(newValue: string) {
		if (newValue) this.logonError = newValue;
	}

	@Emit('setNewData')
	async setNewData(data: any) {
		this.logonError = '';

		if (!data.email) {
			return { email: null, password: null };
		}

		const emailMessage = await validateInput('email', data.email);

		if (emailMessage) {
			this.logonError = emailMessage;
			return { email: null, password: null };
		}

		const newPassword = await sha256(data.password);

		if (this.store.hashedPassword !== newPassword) {
			this.logonError = this.$t('errors.WRONG_PASSWORD').toString();
			return { email: null, password: null };
		}

		if (this.store.email === this.newEmail) {
			this.logonError = this.$t('errors.SAME_EMAIL').toString();
			return { email: null, password: null };
		}

		return { email: data.email, password: newPassword };
	}
}
</script>

<style scoped>
.confirm-button {
	font-size: 18px;
}

.white__container {
	background: #fff;
	border-radius: 14px 14px 0 0;
	height: 51.7vh;
}
.button__update {
	padding: 14px 80px;
	background: #000;
	color: #fff;
	font-weight: 600;
	border-radius: 20px;
	cursor: pointer;
}
</style>
