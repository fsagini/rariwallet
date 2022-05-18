<template>
	<div class="home">
		<img src="../assets/img/auth/cryptobanner2.png" alt="banner" />
		<div class="banner_text">
			<span>Welcome to</span>
			<h1>RARI PAY</h1>
		</div>
		<div class="actions">
			<button @click="navigateSignup">Create Wallet Account</button>
		</div>
		<div class="login-link">
			<span>{{ $t('auth.ALREADY_HAVE_WALLET') }}</span>
			<router-link to="/login" class="login-router transition-faster">
				<span data-cy="logInButton">
					{{ $t('auth.ALREADY_HAVE_ACCOUNT') }}
				</span>
			</router-link>
		</div>
		
	</div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Authenticated } from '../mixins/mixins';

@Component
export default class Welcome extends mixins(Authenticated) {
	navigateSignup() {
		this.$router.push('/signup');
	}
}
</script>

<style scoped>
.home img {
	width: 300px;
	height: 300px;
	background-size: contain;
}
.actions button {
	padding: 10px 50px;
	border-radius: 24px;
	border: none;
	font-size: 19px;
	background: #fff;
	color: #347af0;
	font-weight: 700;
	cursor: pointer;
}
.banner_text {
	position: relative;
	top: -30px;
}
.banner_text span {
	font-size: 20px;
	color: #347af0;
	font-weight: 700;
}
.banner_text h1 {
	font-size: 30px;
	color: #347af0;
	font-weight: 700;
}
</style>