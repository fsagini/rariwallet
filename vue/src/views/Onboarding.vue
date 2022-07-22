<template>
	<div>
		<div class="modal1">
			<div class="onboardingImg">
				<img :src="require(`@/assets/img/onboarding/${modalContent[position].imgSrc}`)" alt="" />
			</div>
			<div class="container figma">
				<div class="steps">
					<div class="carousel" 
					v-for="content in modalContent.length"
					:key ="content"
					:class="'carousel--'+content"
					/>
				</div>
				<div class="headding__crypto">
					<h1>{{ modalContent[position].title }}</h1>
					<span>{{ modalContent[position].subTitle }}</span>
				</div>
				<div class="message">
					<p>{{ modalContent[position].message }}</p>
				</div>
				<div v-if="position < 4" class="actions">
					<button @click="position += 1">Next Step</button>
				</div>
				<div v-else>
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
				</div>
				<div class="bottomborder">
					<hr class="border"/>
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
	position=0
	modalContent: any = [
		{
			imgSrc:"slider1.svg",
			title:"Welcome to",
			subTitle:"RARI PAY",
			message:"Manage all your crypto assets in one place. It's simple and easy"
		},
		{
			imgSrc:"slider2.svg",
			title:"Nice and Tidy Crypto",
			subTitle:"Wallet",
			message:"Keep BTC, ETH, USDC, BNB and many other crypto coins"
		},
		{
			imgSrc:"slider3.svg",
			title:"Send Crypto",
			subTitle:"Coins to Your Friends",
			message:"Send crypto to your friend across the world"
		},
		{
			imgSrc:"slider4.svg",
			title:"Buy Crypto",
			subTitle:"Coins with M-PESA",
			message:"RARI pay changing the dynamics of buying crypto"
		},
		{
			imgSrc:"slider4.svg",
			title:"Your Safety",
			subTitle:"is Our Top Priority",
			message:"Our top-notch security features will keep you completely safe",
			buttonText:"Let's Get Started",
		},
		

	]
}
</script>

<style scoped>
.steps {
	display: flex;
	flex-direction: row;
	justify-items: center;
	align-items: center;
	padding-left: 42%;
}
.bottomborder {
	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;
}
.border {
width: 134px;
height: 6px;
bottom: 0;
border-radius: 10px;
background-color: #CFD2D8;
align-self: center;
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
.carousel {
	width:12px;
	height:12px;
	border-radius: 50%;
	background-color: #CFD2D8;
	margin: 3px;
	align-self: center;
}
</style>