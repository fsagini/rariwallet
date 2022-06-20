import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Transact from '../views/Transact.vue';
import TradeCrypto from '../views/TradeCrypto.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import TwoFA from '../views/TwoFA.vue';
import store from '../store/index';
import Settings from '../views/Settings.vue';
import Unlock from '../views/Unlock.vue';
import SignTx from '../views/SignTx.vue';
import SignMsg from '../views/SignMsg.vue';
import Recovery from '../views/Recovery.vue';
import EmailSettings from '../views/EmailSettings.vue';
import PasswordSettings from '../views/PasswordSettings.vue';
import TwoFactorSettings from '../views/TwoFactorSettings.vue';
import KeysSettings from '../views/KeysSettings.vue';
import RecoverySettings from '../views/RecoverySettings.vue';
import DeleteSettings from '../views/DeleteSettings.vue';
import Send from '../views/Send.vue';
import Onboarding from '../views/Onboarding.vue';
import Portfolio from '../views/Portfolio.vue';
import BuyAsset from '../views/Deposit.vue';
import Withdraw from '../views/Withdraw.vue';
import Transactions from '../views/Transactions.vue';
import Portfoliomenu from '../views/Portfoliomenu.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/signup',
		name: 'Signup',
		component: Signup
	},
	{
		path: '/settings',
		name: 'Settings',
		component: Settings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/settings/email',
		name: 'EmailSettings',
		component: EmailSettings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/portfolio/menu',
		name: 'Portfoliomenu',
		component: Portfoliomenu,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/settings/password',
		name: 'PasswordSettings',
		component: PasswordSettings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/settings/2fa',
		name: 'TwoFactorSettings',
		component: TwoFactorSettings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/settings/keys',
		name: 'KeysSettings',
		component: KeysSettings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/settings/recovery',
		name: 'RecoverySettings',
		component: RecoverySettings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/settings/delete',
		name: 'DeleteSettings',
		component: DeleteSettings,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/buy/asset',
		name: 'BuyAsset',
		component: BuyAsset,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/recovery',
		name: 'Recovery',
		component: Recovery
	},
	{
		path: '/withdraw/asset',
		name: 'Withdraw',
		component: Withdraw,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/2fa',
		name: 'TwoFA',
		component: TwoFA,
		meta: {
			requires2fa: true
		}
	},
	{
		path: '/unlock',
		name: 'Unlock',
		component: Unlock
	},
	{
		path: '/signtx',
		name: 'SignTx',
		component: SignTx,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/signmsg',
		name: 'SignMsg',
		component: SignMsg,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/',
		name: 'Portfolio',
		component: Portfolio,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/your/transactions',
		name: 'Transactions',
		component: Transactions,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/trade',
		name: 'TradeCrypto',
		component: TradeCrypto,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/rari/onboarding',
		name: 'Onboarding',
		component: Onboarding
	},
	{
		path: '/trade/buy/:addr/:id/',
		name: 'Transact',
		component: Transact,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/send/asset',
		name: 'Send',
		component: Send,
		meta: {
			requiresAuth: true
		}
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach(async (to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (store.getters.isLoggedIn) {
			if (store.state.redirectPath) {
				const path = store.state.redirectPath;
				store.commit('setRedirect', '');
				next(path);
			} else {
				next();
			}

			return;
		}
		if (to.path && to.path !== '/') {
			store.commit('setRedirect', to.path);
		}

		if (store.getters.twoFaRequired) {
			next('/2fa');
			return;
		}

		await store.dispatch('loadEncryptedSeed');
		if (store.state.email) {
			next('/unlock');
			return;
		}
		next('/login');
	} else if (to.matched.some((record) => record.meta.requires2fa)) {
		if (store.getters.twoFaRequired) {
			next();
			return;
		}
		if (store.getters.isLoggedIn) {
			next('/');
			return;
		}

		next('/login');
	} else {
		next();
	}
});

export default router;
