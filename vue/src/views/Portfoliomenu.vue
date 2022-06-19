<template>
	<div>
		<div class="back-menu" @click="navigateBack()">
			<i class="fa-solid fa-angles-left"></i>
		</div>
		<transition-group tag="ul" name="list" class="menu__list">
			<li @click="navigatePath(menu.path)" class="menu__row" v-for="menu in menuData" :key="menu.icon">
				<div id="icon" :class="menu.icon"></div>
				<div id="title">{{ menu.title }}</div>
			</li>
		</transition-group>
	</div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Authenticated, Global } from '../mixins/mixins';

export default class Portfoliomenu extends mixins(Global, Authenticated) {
	menuData: any = [
		{
			title: 'Wallet',
			icon: 'fa-solid fa-wallet',
			path: '/'
		},
		{
			title: 'Buy Asset',
			icon: 'fa-solid fa-circle-plus',
			path: '/buy/asset'
		},
		{
			title: 'Withdraw',
			icon: 'fa-solid fa-circle-minus',
			path: '/withdraw/asset'
		},
		{
			title: 'Transfer',
			icon: 'fa-solid fa-location-arrow',
			path: '/send/asset'
		},
		{
			title: 'Profile',
			icon: 'fa-solid fa-user',
			path: '/settings'
		}
	];

	navigatePath(path: string) {
		this.router.push(path).catch(() => undefined);
	}
	navigateBack() {
		this.router.push('/').catch(() => undefined);
	}
}
</script>

<style scoped>
.menu__list {
	height: auto;
	padding: 0;
	width: 100%;
	border-radius: 10px;
}
.menu__row {
	height: 50px;
	width: 70%;
	border-radius: 0px;
	background: rgb(255, 255, 255);
	display: flex;
	margin: 10px;
	flex-direction: row;
	justify-content: center;
	cursor: pointer;
	align-items: center;
}
.menu__row #icon {
	flex: 30%;
	font-size: 25px;
	color: #228cdb;
}
.menu__row #title {
	flex: 30%;
	font-size: 20px;
}
.back-menu {
	display: flex;
	margin-left: 20px;
	padding: 10px 2px;
	border: 1px solid #fff;
	width: 50px;
	margin-bottom: 20px;
	cursor: pointer;
}
.fa-angles-left {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 25px;
	color: #fff;
	margin-left: 10px;
}
</style>