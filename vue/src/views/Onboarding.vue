<template>
	<div>
		<div class="modal1">
			<div class="onboardingImg">
				<img src="../assets/img/auth/cryptobanner2.png" alt="" />
			</div>
			<div class="container figma">
				<div class="steps">
					<p>__ __ __ __ __</p>
				</div>
				<div class="headding__crypto">
					<h1>Welcome to</h1>
					<span>RARI PAY</span>
				</div>
				<div class="message">
					<p>Manage all your crypto assets in one place. It's simple and easy</p>
				</div>
				<div class="actions">
					<button>Next Step</button>
				</div>
				<div class="border">___________________</div>
			</div>
		</div>
		<div class="modal2">
			<div class="modal1">
				<div class="onboardingImg2">
					<img src="../assets/img/onboarding/tidy.png" alt="" />
				</div>
				<div class="container figma">
					<div class="steps">
						<p>__ __ __ __ __</p>
					</div>
					<div class="headding__crypto">
						<h1>Nice and Tidy Crypto</h1>
						<span>Wallet</span>
					</div>
					<div class="message">
						<p>Keep BTC, ETH, USDC, BNB and many other crypto coins</p>
					</div>
					<div class="actions">
						<button>Next Step</button>
					</div>
					<div class="border">___________________</div>
				</div>
			</div>
		</div>
		<div class="modal3">
			<div class="modal1">
				<div class="onboardingImg3">
					<img src="../assets/img/onboarding/send.png" alt="" />
				</div>
				<div class="container figma">
					<div class="steps">
						<p>__ __ __ __ __</p>
					</div>
					<div class="headding__crypto">
						<h1>Send Crypto</h1>
						<span>Coins to Your Friends</span>
					</div>
					<div class="message">
						<p>Send crypto to your friend across the world</p>
					</div>
					<div class="actions">
						<button>Next Step</button>
					</div>
					<div class="border">___________________</div>
				</div>
			</div>
		</div>
		<div class="modal4">
			<div class="modal4">
				<div class="onboardingImg4">
					<img src="../assets/img/onboarding/mpesa.png" alt="" />
				</div>
				<div class="container figma">
					<div class="steps">
						<p>__ __ __ __ __</p>
					</div>
					<div class="headding__crypto">
						<h1>Buy Crypto</h1>
						<span>Coins with M-PESA</span>
					</div>
					<div class="message">
						<p>RARI pay changing the dynamics of buying crypto</p>
					</div>
					<div class="actions">
						<button>Next Step</button>
					</div>
					<div class="border">___________________</div>
				</div>
			</div>
		</div>
		<div class="modal5">
			<div class="modal5" >
				<div class="onboardingImg4">
					<img src="../assets/img/onboarding/getstarted.png" alt="" />
				</div>
				<div class="container figma">
					<div class="steps">
						<p>__ __ __ __ __</p>
					</div>
					<div class="headding__crypto">
						<h1>Your Safety</h1>
						<span>is Our Top Priority</span>
					</div>
					<div class="message">
						<p>Our top-notch security features will keep you completely safe</p>
					</div>
					<div class="actions1">
						<button>Let's Get Started</button>
					</div>
					<div class="login-link">
						<p>{{ $t('auth.ALREADY_HAVE_WALLET') }}</p>
						<router-link to="/login" class="login-router transition-faster">
							<p data-cy="logInButton">
								{{ $t('auth.ALREADY_HAVE_ACCOUNT') }}
							</p>
						</router-link>
					</div>
					<div class="border">___________________</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Global } from '../mixins/mixins';
@Component
export default class Onboarding extends mixins(Global) {
    modal1:true

}
</script>

<style scoped>
.border {
	font-size: 20px;
	font-weight: 700;
	bottom: 0;
}
.figma {
	background: #fff;
	border-radius: 14px 14px 0 0;
}
.onboardingImg img {
	width: 250px;
	height: 250px;
	background-size: cover;
}
.onboardingImg4 img {
	width: 250px;
	height: 250px;
	background-size: cover;
}
.headding__crypto {
	padding-top: 20px;
	padding: 5px;
}
.headding__crypto h1,
span {
	font-weight: 600;
	font-size: 22px;
}
.actions1 {
	padding: 10px;
}
.actions1 button {
	border: 1px solid #fff;
	background: #347af0;
	border-radius: 24px;
	padding: 15px 50px;
	color: #fff;
	cursor: pointer;
	font-size: 17px;
	font-weight: 600;
}
.message {
	padding: 5px;
}
.message p {
	font-size: 16px;
}
.actions {
	padding: 10px;
}
.actions button {
	border: 1px solid #347af0;
	background: #fff;
	border-radius: 24px;
	padding: 10px 50px;
	cursor: pointer;
	font-size: 17px;
	font-weight: 600;
}
</style>