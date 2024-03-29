import {
	TypeCreateTransactions,
	TypeMakeSTKPushMpesa,
	TypePayCustomerMpesa,
	TypeChangePhoneNumber,
	TypeFetchCoins,
	TypeUserPhoneNumber,
	TypeFetchUserWalletAssets
} from './../types/global-types';
import Vue from 'vue';
import * as zksync from "zksync-web3";
import Vuex, { Store } from 'vuex';
import { ethers } from 'ethers';
import { cryptoDecrypt, sha256 } from '../utils/cryptoFunctions';

import {
	getEncryptedSeedFromMail,
	verifyAuthenticatorCode,
	verifyEmailCode,
	saveWalletEmailPassword,
	send2FAEmail,
	getPayload,
	getKeystoreFromEncryptedSeed,
	changePasswordEncryptedSeed,
	getBackendEndpoint,
	getNonce,
	recoverSeedSocialRecovery,
	verifyEmailConfirmationCode,
	SaveBlockChainTransactions,
	sendSTKPushPaymentRequest,
	makeBusinesstoCustomerPayment,
	verifyMpesaSTKPushPayment,
	getUserPhoneFromDB
} from '../utils/backupRestore';
import { downloadEncryptedKeystore, sortObject } from '../utils/utils';
import { getKeystore } from '../utils/keystore';
import { getSessionStore, saveSessionStore, removeSessionStore } from '../utils/sessionStore';
import * as Sentry from '@sentry/vue';

import {
	TransactionReceipt,
	TransactionObject,
	Type2FARequired,
	TypeSeedFoundData,
	TypeSeedCreatedData,
	TypeFetchUser,
	TypeUnlock2fa,
	TypeUserFoundData,
	TypeUnlockWithPassword,
	MorpherWalletConfig,
	TypeChangePassword,
	TypeEncryptedSeed,
	TypeKeystoreUnlocked,
	TypeRequestParams,
	TypeChangeEmail,
	Type2FAUpdateParams,
	TypeRecoveryParams,
	TypeAddRecoveryParams,
	TypeResetRecovery,
	TypeUpdatePrivateKey,
	TypeUpdateSeedPhrase,
	TypeShowPhraseKeyVariables,
	TypeExportPhraseKeyVariables,
	TypeUpdateRecovery,
	TypeUpdateUserPayload,
	TypeCreateUser
} from '../types/global-types';

import isIframe from '../utils/isIframe';
import { connectToParent } from 'penpal';
import { CallSender, Connection } from 'penpal/lib/types';
import router from '@/router';
import download from 'downloadjs';

import { i18n } from '../plugins/i18n';
import Cookie from 'js-cookie';
import { fetchCryptoList } from '@/utils/cryptoListFetching';
import { userAssetsFetching } from '@/utils/userAssetsFetching';
Vue.use(Vuex);

/*
 * Store type definition
 */
export interface RootState {
	loading: boolean;
	isNetworkError: boolean;
	checkoutRequestID: string;
	TransactionCodeId: string;
	TransactionDesc: string;
	status: string;
	spinnerStatusText: string;
	message: string;
	email: string;
	phonenumber: string;
	iconSeed: number;
	hashedPassword: string;
	encryptedSeed: TypeEncryptedSeed;
	encryptedWallet: string;
	keystore: zksync.Wallet | null;
	accounts: Array<string>;
	walletCoins: any;
	walletUserAssets: any;
	walletUserTransactions: any;
	token: string;
	twoFaRequired: Type2FARequired;
	connection: Connection<CallSender> | null;
	transactionDetails: any;
	messageDetails: any;
	openPage: string;
	loginComplete: boolean;
	recoveryMethods: Array<any>;
	seedExported: boolean;
	keystoreExported: boolean;
	seedPhrase: string;
	privateKey: string;
	privateKeyKeystore: string;
	signMessage: any;
	signResponse: any;
	ethBalance: string;
	unlocking: boolean;
	redirectPath: string;
	loginRetryCount: number;
	ipCountry: string;
	app_lang: string;
}

/**
 * initialize the store
 */

function initialState(): RootState {
	const email = localStorage.getItem('email') || '';
	const phonenumber = window.localStorage.getItem('phonenumber') || '';
	const walletCoins = localStorage.getItem('storeCoins') || [];
	const walletUserTransactions = localStorage.getItem('walletUserTransactions') || [];
	const walletUserAssets = localStorage.getItem('userAssets') || [];
	const iconSeed = parseInt(localStorage.getItem('iconSeed') || '') || null;
	const hashedPassword = '';

	Sentry.configureScope((scope) => {
		scope.setUser({ id: '', email: email, phonenumber: phonenumber });
	});

	return {
		loading: false,
		isNetworkError: false,
		checkoutRequestID: '',
		TransactionCodeId: '',
		TransactionDesc: '',
		status: '',
		spinnerStatusText: '',
		message: '',
		email,
		phonenumber,
		iconSeed,
		hashedPassword,
		encryptedSeed: {},
		encryptedWallet: '',
		keystore: null,
		accounts: [],
		twoFaRequired: {
			email: false,
			authenticator: false,
			authenticatorConfirmed: false,
			needConfirmation: false
		},
		token: '',
		connection: null,
		transactionDetails: {},
		messageDetails: null,
		openPage: '',
		loginComplete: false,
		recoveryMethods: [],
		walletCoins,
		walletUserTransactions,
		walletUserAssets,
		seedExported: false,
		keystoreExported: false,
		seedPhrase: '',
		privateKey: '',
		privateKeyKeystore: '',
		signMessage: null,
		signResponse: null,
		ethBalance: '0',
		unlocking: true,
		redirectPath: '',
		loginRetryCount: 0,
		ipCountry: '',
		app_lang: ''
	} as RootState;
}

/**
 * Store state object
 */
const store: Store<RootState> = new Vuex.Store({
	state: initialState(),
	modules: {},

	// Store Mutations(methods, initial propeties update)
	mutations: {
		authRequested(state: RootState) {
			state.status = 'loading';
		},
		loading(state: RootState, statusMessage: string) {
			if (statusMessage != '') {
				state.loading = true;
				state.spinnerStatusText = statusMessage;
			} else {
				state.spinnerStatusText = '';
				state.loading = false;
			}
		},
		updateNetworkError(state: RootState, isNetworkError: boolean) {
			state.isNetworkError = isNetworkError;
		},
		setRedirect(state: RootState, path: string) {
			state.redirectPath = path;
		},
		delayedSpinnerMessage(state: RootState, statusMessage: string) {
			state.loading = true;
			state.spinnerStatusText = statusMessage;
			setTimeout(() => {
				state.loading = false;
			}, 10000);
		},
		seedFound(state: RootState, seedFoundData: TypeSeedFoundData) {
			state.status = 'success';
			state.encryptedSeed = seedFoundData.encryptedSeed;
			sessionStorage.setItem('encryptedSeed', JSON.stringify(seedFoundData.encryptedSeed));
			localStorage.setItem('login', 'true');
		},
		recoveryMethodsFound(state: RootState, recoveryMethodsData: Array<any>) {
			localStorage.setItem('recoveryMethods', JSON.stringify(recoveryMethodsData));
			state.recoveryMethods = recoveryMethodsData;
		},
		updateUnlocking(state: RootState, payload: boolean) {
			state.unlocking = payload;
		},
		updatePayload(state: RootState, payload: Type2FARequired) {
			state.twoFaRequired.email = payload.email;
			state.twoFaRequired.authenticator = payload.authenticator;
			state.twoFaRequired.authenticatorConfirmed = payload.authenticatorConfirmed;
			state.twoFaRequired.needConfirmation = payload.needConfirmation || false;
			state.app_lang = payload.app_lang || '';
		},
		ipCountry(state: RootState, ipCountry: string) {
			state.ipCountry = ipCountry || '';
		},
		userFound(state: RootState, userData: TypeUserFoundData) {
			state.email = userData.email;
			state.phonenumber = userData.phonenumber;
			state.hashedPassword = userData.hashedPassword;
			Sentry.configureScope((scope) => {
				scope.setUser({
					id: state.accounts && state.accounts.length > 0 ? state.accounts[0] : '',
					email: state.email,
					phonenumber: state.phonenumber
				});
			});
			window.console.log(userData.email);
			window.localStorage.setItem('email', userData.email);
			saveSessionStore('password', userData.hashedPassword);
		},
		seedCreated(state: RootState, seedCreatedData: TypeSeedCreatedData) {
			state.status = 'created';
			state.email = seedCreatedData.email;
			state.phonenumber = seedCreatedData.phonumber;
			state.encryptedSeed = seedCreatedData.encryptedSeed;
			state.hashedPassword = seedCreatedData.hashedPassword;
			localStorage.setItem('email', seedCreatedData.email);
			window.localStorage.setItem('phonenumber', seedCreatedData.phonumber);
			sessionStorage.setItem('encryptedSeed', JSON.stringify(seedCreatedData.encryptedSeed));
			localStorage.setItem('login', 'true');
			saveSessionStore('password', seedCreatedData.hashedPassword);
			window.localStorage.setItem('phonenumber', seedCreatedData.phonumber);
			Sentry.configureScope((scope) => {
				scope.setUser({
					id: state.accounts && state.accounts.length > 0 ? state.accounts[0] : '',
					email: state.email,
					phonenumber: state.phonenumber
				});
			});
		},
		setPage(state: RootState, page) {
			state.openPage = page;
		},
		authError(state: RootState, message) {
			(state.status = 'error'), (state.message = message);
			state.email = '';
			state.phonenumber = '';
			state.hashedPassword = '';
			sessionStorage.removeItem('encryptedSeed');
			localStorage.removeItem('login');
			const email = localStorage.getItem('email');
			if (email) localStorage.setItem('lastEmail', email);
			const phonenumber = localStorage.getItem('phonenumber');
			if (phonenumber) localStorage.setItem('lastPhoneNumber', phonenumber);
			localStorage.removeItem('email');
			localStorage.removeItem('phonenumber');
			localStorage.removeItem('iconSeed');
			removeSessionStore('password');
			state.loginRetryCount = 0;
			router.push('/login').catch(() => undefined);
			Sentry.configureScope((scope) => {
				scope.setUser({ id: '', email: '', phonenumber: '' });
			});
		},
		logout(state: RootState) {
			state.email = '';
			state.phonenumber = '';
			state.hashedPassword = '';
			state.encryptedSeed = {};
			state.keystore = null;

			state.status = '';
			state.token = '';
			const email = localStorage.getItem('email');
			if (email) localStorage.setItem('lastEmail', email);
			const phonenumber = localStorage.getItem('phonenumber');
			if (phonenumber) localStorage.setItem('lastPhoneNumber', phonenumber);
			localStorage.removeItem('email');
			localStorage.removeItem('phonenumber');
			localStorage.removeItem('iconSeed');
			localStorage.removeItem('recoveryMethods');
			removeSessionStore('password');
			sessionStorage.removeItem('encryptedSeed');
			localStorage.removeItem('login');
			localStorage.removeItem('storeCoins');
			localStorage.removeItem('userAssets');
			Sentry.configureScope((scope) => {
				scope.setUser({ id: '', email: '', phonenumber: '' });
			});
		},
		clearUser(state: RootState) {
			state.email = '';
			state.phonenumber = '';
			state.hashedPassword = '';
			state.encryptedSeed = {};
			state.keystore = null;

			state.status = '';
			state.token = '';
			Sentry.configureScope((scope) => {
				scope.setUser({ id: '', email: '', phonenumber: '' });
			});
		},
		keystoreUnlocked(state: RootState, payload: TypeKeystoreUnlocked) {
			state.keystore = payload.keystore;
			state.accounts = payload.accounts;
			state.hashedPassword = payload.hashedPassword;

			if (payload.accounts && payload.accounts[0])
				Sentry.configureScope((scope) => {
					scope.setUser({ id: payload.accounts[0], email: state.email, phonenumber: state.phonenumber });
				});
			window.localStorage.setItem('iconSeed', parseInt(payload.accounts[0].slice(2, 10), 16).toString());
			saveSessionStore('password', payload.hashedPassword);

			const currentLocale = Cookie.get('locale');
			if (currentLocale) {
				store.dispatch('updateUserPayload', { column: 'app_lang', value: currentLocale });
			}
		},
		seedExported(state: RootState) {
			state.seedExported = true;
		},
		keystoreExported(state: RootState) {
			state.keystoreExported = true;
		},
		updatePrivateKey(state: RootState, payload: TypeUpdatePrivateKey) {
			state.privateKey = payload.privateKey;
		},
		updateSeedPhrase(state: RootState, payload: TypeUpdateSeedPhrase) {
			state.seedPhrase = payload.seedPhrase;
		},
		updateEmail(state: RootState, payload: string) {
			state.email = payload;
		}
	},

	// Store  Actions( What Should be performed when an action is required)
	actions: {
		showSpinner({ commit }, message: string) {
			commit('loading', message);
		},
		hideSpinner({ commit }) {
			commit('loading', '');
		},
		showSpinnerThenAutohide({ commit }, message: string) {
			commit('delayedSpinnerMessage', message);
		},
		showNetworkError({ commit }, isNetworkError: boolean) {
			commit('updateNetworkError', isNetworkError);
		},
		async loadEncryptedSeed({ commit }) {
			let encryptedSeed: TypeEncryptedSeed = {};
			const sessionEncryptedSeed = await getSessionStore('encryptedSeed');
			if (sessionEncryptedSeed) {
				try {
					encryptedSeed = JSON.parse(String(sessionEncryptedSeed));
					if (encryptedSeed && encryptedSeed.ciphertext) {
						commit('seedFound', { encryptedSeed });
					}
				} catch (ex) {
					encryptedSeed = {};
				}
			}
		},
		/**
		 * Fetch the user data from the database and attempt to unlock the wallet using the mail encrypted seed
		 ***/

		async fetchUser({ commit, rootState, dispatch }, params: TypeFetchUser) {
			dispatch('fetchUserWalletAssets');
			dispatch('loadAllSupportedCoins');
			commit('updateUnlocking', true);
			const email: string = params.email;
			const phonenumber = params.phonenumber;
			const password: string = params.password;
			const recaptchaToken: string = params.recaptchaToken;
			commit('logout');
			return new Promise((resolve, reject) => {
				commit('authRequested');
				sha256(password)
					.then((hashedPassword) => {
						getPayload(email, recaptchaToken)
							.then((payload) => {
								rootState.loginRetryCount = 0;
								commit('ipCountry', payload.ip_country);
								commit('userFound', { email, phonenumber, hashedPassword });
								commit('updatePayload', payload);
								dispatch('getUserPhoneNumberFromDB', { email });
								if (payload.email || payload.needConfirmation) {
									send2FAEmail(email)
										.then(() => {
											commit('updateUnlocking', false);
											resolve;
										})
										.catch((e) => {
											commit('updateUnlocking', false);
											reject(e);
										});
								}

								if (!payload.email && !payload.authenticator && !payload.needConfirmation) {
									getEncryptedSeedFromMail(email, '', '', recaptchaToken)
										.then((encryptedSeed) => {
											commit('updateUnlocking', false);
											commit('seedFound', { encryptedSeed });
											resolve(true);
										})
										.catch(() => {
											commit('updateUnlocking', false);
											reject;
										});
								} else {
									commit('updateUnlocking', false);
									resolve(true);
								}
							})
							.catch((err) => {
								commit('updateUnlocking', false);
								commit('authError', "The user wasn't found: Signup first!");
								reject(err);
							});
					})
					.catch(() => {
						commit('updateUnlocking', false);
						reject(new Error('error'));
					});
			});
		},
		async getUserPhoneNumberFromDB({ state }, params: TypeUserPhoneNumber) {
			getUserPhoneFromDB(params.email).then((value) => {
				const { phonenumber } = value;
				window.localStorage.setItem('phonenumber', phonenumber);
				state.phonenumber = phonenumber;
			});
		},
		async loadAllSupportedCoins({ commit, state }, params: TypeFetchCoins) {
			await fetchCryptoList(params, commit).then((value) => {
				window.localStorage.setItem('storeCoins', JSON.stringify(value));
				state.walletCoins = JSON.stringify(value);
				window.console.log(state.walletCoins);
			});
		},
		async fetchUserWalletAssets({ commit, state }, params: TypeFetchUserWalletAssets) {
			await userAssetsFetching(params, commit).then((value) => {
				window.localStorage.setItem('userAssets', JSON.stringify(value));
				state.walletUserAssets = JSON.stringify(value);
				window.console.log(state.walletUserAssets);
			});
		},
		fetchWalletFromRecovery({ state, commit }, params: TypeRecoveryParams) {
			commit('updateUnlocking', true);
			return new Promise((resolve, reject) => {
				recoverSeedSocialRecovery(params.accessToken, state.email, params.recoveryTypeId)
					.then((encryptedSeed) => {
						commit('seedFound', { encryptedSeed });
						getKeystoreFromEncryptedSeed(state.encryptedSeed, params.password)
							.then(async (keystore: zksync.Wallet) => {
								state.loginRetryCount = 0;
								//not setting any password here, this is simply for the password change mechanism
								commit('keystoreUnlocked', { keystore, accounts: [keystore.address], hashedPassword: '' });
								commit('updateUnlocking', false);
								resolve(true);
							})
							.catch(() => {
								state.loginRetryCount += 1;
								if (state.loginRetryCount >= 3) commit('authError', 'Cannot unlock the Keystore, wrong ID');
								commit('updateUnlocking', false);
								reject(false);
							});
					})
					.catch(() => {
						commit('updateUnlocking', false);
						reject(false);
					});
			});
		},
		addRecoveryMethod({ state, dispatch }, params: TypeAddRecoveryParams) {
			return new Promise(async (resolve, reject) => {
				const encryptedSeed = await changePasswordEncryptedSeed(state.encryptedSeed, state.hashedPassword, params.password);
				dispatch('sendSignedRequest', {
					body: {
						encryptedSeed,
						recoveryTypeId: params.recoveryTypeId,
						key: params.key
					},
					method: 'POST',
					url: getBackendEndpoint() + '/v1/auth/addRecoveryMethod'
				})
					.then(() => {
						dispatch('updateRecoveryMethods', { dbUpdate: true }).then(async () => {
							try {
								if (state.connection && state.connection !== null) {
									const promise = state.connection.promise;

									let type;

									if (params.recoveryTypeId == 3) {
										type = 'google';
									}

									if (type) {
										(await promise).onRecoveryUpdate(type, true);
									}
								}
							} catch {
								console.error('Error calling onRecoveryUpdate callback');
							}
							resolve(true);
						});
					})
					.catch(reject);
			});
		},
		hasRecovery({ state }, id: number) {
			return (
				state.recoveryMethods
					.map((obj) => {
						return obj.id;
					})
					.indexOf(id) !== -1
			);
		},
		/**
		 * Fetch the user data from the database and attempt to unlock the wallet using the mail encrypted seed
		 */
		createWallet({ commit, dispatch }, params: TypeCreateUser) {
			return new Promise((resolve, reject) => {
				sha256(params.password).then((hashedPassword) => {
					getPayload(params.email, params.recaptchaToken)
						.then(() => {
							reject('USER_ALREADY_EXISTS');
						})
						.catch(async (error) => {
							if (error.error && error.error === 'RECAPTCHA_REQUIRED') {
								return reject(error);
							}
							commit('authRequested');
							commit('loading', 'Creating new Keystore...');
							/**
							 * If no wallet was found, then create a new one (seed = false) otherwise use the decrypted seed from above
							 */
							const createdKeystoreObj = await getKeystore(hashedPassword, {}, 1);
							saveWalletEmailPassword(
								params.email,
								params.phonenumber,
								createdKeystoreObj.encryptedSeed,
								createdKeystoreObj.keystore.address,
								params.recaptchaToken
							)
								.then(() => {
									commit('clearUser');
									dispatch('fetchUser', {
										email: params.email,
										password: params.password,
										phonenumber: params.phonenumber,
										recaptchaToken: params.recaptchaToken
									})
										.then(resolve)
										.catch((e) => {
											reject(e);
											commit('delayedSpinnerMessage', 'Unknown Error occurred during saving.');
											reject(e);
										});
								})
								.catch((e) => {
									reject(e);
								});
						});
				});
			});
		},
		async sendMpesaStkPush({ commit }, params: TypeMakeSTKPushMpesa) {
			sendSTKPushPaymentRequest(params.phonenumber, params.amount)
				.then(async (response) => {
					const { CustomerMessage, CheckoutRequestID } = response;
					window.console.log(response);
					commit('delayedSpinnerMessage', CustomerMessage);
					commit('loading', 'verifying payment...');
					setTimeout(() => {
						verifyMpesaSTKPushPayment(CheckoutRequestID)
							.then((result) => {
								const { ResultCode, ResultDesc } = result;
								if (ResultCode == '0') {
									commit('delayedSpinnerMessage', ResultDesc);
									commit('loading', 'initiating blockchain transaction...');
									// After a Series research here would be the best place to dispatch blockchain action.
									// Dispatch Blockchain Transactions
								} else if (ResultCode === '1032') {
									commit('delayedSpinnerMessage', ResultDesc);
									router.push('/transaction/not/found');
								} else if (ResultCode === '2001') {
									commit('delayedSpinnerMessage', ResultDesc);
									router.push('/transaction/not/found');
								} else {
									commit('delayedSpinnerMessage', ResultDesc);
									router.push('/transaction/not/found');
								}
							})
							.catch((err) => {
								commit('delayedSpinnerMessage', err.message);
							});
					}, 40000);
				})
				.catch((error) => {
					commit('delayedSpinnerMessage', error.message);
				});
		},
		async makeBusiness2CustoerPayment({ commit }, params: TypePayCustomerMpesa) {
			await makeBusinesstoCustomerPayment(params.phonenumber, params.amount)
				.then((response) => {
					// commit success message
				})
				.catch((error) => {
					commit('delayedSpinnerMessage', error.message);
				});
		},
		//** Save Transactions */
		async createTransaction({ commit }, params: TypeCreateTransactions) {
			commit('loading', 'saving your transaction');
			await SaveBlockChainTransactions(
				params.transaction_id,
				params.coins,
				params.transaction_type,
				params.coin_type,
				params.date,
				params.value,
				params.from,
				params.to,
				params.time
			)
				.then(() => {
					commit('loading', 'record save successfully');
				})
				.catch((error) => {
					commit('delayedSpinnerMessage', error.message);
				});
		},

		async loginWallet({ state, dispatch }, recaptchaToken) {
			if (!state.email && !state.hashedPassword) {
				const email = localStorage.getItem('email') || '';
				const phonenumber = localStorage.getItem('phonenumber') || '';
				const iconSeed = parseInt(localStorage.getItem('iconSeed') || '') || 0;
				const hashedPassword = await getSessionStore('password');
				let encryptedSeed: TypeEncryptedSeed = {};
				const sessionEncryptedSeed = await getSessionStore('encryptedSeed');
				if (sessionEncryptedSeed) {
					try {
						encryptedSeed = JSON.parse(String(sessionEncryptedSeed));
					} catch {
						encryptedSeed = {};
					}
				}
				state.email = email;
				state.phonenumber = phonenumber;
				state.iconSeed = iconSeed;
				state.hashedPassword = hashedPassword;
				state.encryptedSeed = encryptedSeed;
				Sentry.configureScope((scope) => {
					scope.setUser({
						id: state.accounts && state.accounts.length > 0 ? state.accounts[0] : '',
						email: state.email,
						phonenumber: state.phonenumber
					});
				});
			}
			dispatch('unlockWithStoredPassword', recaptchaToken)
				.then((result) => {
					if (result) {
						router.push('/').catch(() => undefined);
					}
				})
				.catch((error) => {
					if (error !== true && error !== false) {
						// console.log('Error in unlock', error);
					}
				});
		},
		async logoutWallet({ commit }) {
			await commit('logout');
			if (router.currentRoute.path !== '/login') router.push('/login').catch(() => undefined);
		},
		clearPage({ commit }) {
			commit('setPage', '');
		},
		/**
		 * Unlock wallet using 2fa codes
		 */
		unlock2FA({ commit, dispatch, state, rootState }, params: TypeUnlock2fa) {
			return new Promise(async (resolve, reject) => {
				let emailCorrect = false;
				let authenticatorCorrect = false;
				let userConfirmed = false;

				if (state.twoFaRequired.email == true) {
					const result = await verifyEmailCode(rootState.email, params.email2FA);

					if (result.success) {
						rootState.loginRetryCount = 0;
						emailCorrect = true;
					} else {
						rootState.loginRetryCount += 1;
						if (rootState.loginRetryCount >= 3) commit('authError', '2FA Email code not correct');
						reject(result.error);
						return;
					}
				} else {
					emailCorrect = true;
				}

				if (state.twoFaRequired.authenticator == true) {
					const result = await verifyAuthenticatorCode(rootState.email, params.authenticator2FA);

					if (result.success) {
						authenticatorCorrect = true;
						rootState.loginRetryCount = 0;
					} else {
						rootState.loginRetryCount += 1;
						if (rootState.loginRetryCount >= 3) commit('authError', '2FA Authenticator code not correct');
						reject(result.error);
						return;
					}
				} else {
					authenticatorCorrect = true;
				}

				if (state.twoFaRequired.needConfirmation == true) {
					const result = await verifyEmailConfirmationCode(rootState.email, params.email2FA);
					if (result.success) {
						userConfirmed = true;
						state.loginRetryCount = 0;
					} else {
						state.loginRetryCount += 1;
						if (state.loginRetryCount >= 3) commit('authError', 'Confirmation Email code not correct');
						reject(result.error);
						return;
					}
				} else {
					userConfirmed = true;
				}

				if (emailCorrect && authenticatorCorrect && userConfirmed) {
					getEncryptedSeedFromMail(rootState.email, params.email2FA, params.authenticator2FA, params.recaptchaToken)
						.then((encryptedSeed) => {
							//const encryptedSeed = state.encryptedSeed; //normally that would need decrypting using 2fa codes
							//commit('updatePayload', { email: false, authenticator: false });
							commit('seedFound', { encryptedSeed });
							if (state.hashedPassword) {
								dispatch('unlockWithStoredPassword', params.recaptchaToken)
									.then(() => resolve('/'))
									.catch(() => {
										const email = rootState.email;
										commit('logout');
										rootState.email = email;
										reject('invalid password');
									});
							} else {
								//unlock page
								resolve('/unlock');
							}
						})
						.catch((err) => {
							if (err.toString() === 'seed not found') {
								commit('authError', '2FA Authentication code not correct');
								reject('2FA Authentication not correct');
							} else {
								reject(err);
							}
						});
				} else {
					reject();
				}
			});
		},
		/**
		 * Unlock wallet using the password stored in local state
		 */
		async unlockWithStoredPassword({ dispatch, commit, state }, recaptchaToken: string) {
			commit('updateUnlocking', true);
			if (!state.encryptedSeed || !state.encryptedSeed.ciphertext) {
				await dispatch('loadEncryptedSeed');
			}

			if (!state.hashedPassword) {
				await dispatch('loadPassword');
			}
			return new Promise((resolve, reject) => {
				if (state.hashedPassword && state.encryptedSeed.ciphertext !== undefined) {
					dispatch('unlockWithPassword', { password: state.hashedPassword, recaptchaToken })
						.then(() => {
							commit('updateUnlocking', false);
							resolve(true);
						})
						.catch((e) => {
							commit('updateUnlocking', false);
							reject(e);
						});
				} else {
					commit('updateUnlocking', false);
					reject(new Error());
				}
			});
		},
		unlockUpdate({ commit }) {
			commit('updateUnlocking', false);
		},
		/**
		 * Unlock wallet using the password entered on the logon form
		 */
		unlockWithPassword({ commit, state, dispatch }, params: TypeUnlockWithPassword) {
			commit('updateUnlocking', true);
			return new Promise((resolve, reject) => {
				getKeystoreFromEncryptedSeed(state.encryptedSeed, params.password)
					.then(async (keystore: zksync.Wallet) => {
						state.loginRetryCount = 0;
						commit('keystoreUnlocked', { keystore, accounts: [keystore.address], hashedPassword: params.password });
						getPayload(state.email, params.recaptchaToken)
							.then((payload) => {
								commit('ipCountry', payload.ip_country);
								commit('updatePayload', payload);
								dispatch('updateRecoveryMethods', { dbUpdate: false }).then(() => {
									resolve(true);
								});
							})
							.catch((e) => {
								reject(e);
							});
						commit('updateUnlocking', false);
					})
					.catch((err) => {
						commit('updateUnlocking', false);
						state.loginRetryCount += 1;
						if (state.loginRetryCount >= 3) commit('authError', "The user wasn't found: Signup first!");
						reject(err);
					});
			});
		},

		updateRecoveryMethods({ commit, dispatch }, params: TypeUpdateRecovery) {
			return new Promise((resolve, reject) => {
				if (localStorage.getItem('recoveryMethods') && params.dbUpdate !== true) {
					const methods = JSON.parse(localStorage.getItem('recoveryMethods') || '');
					commit('recoveryMethodsFound', methods);
					resolve(true);
				} else {
					dispatch('sendSignedRequest', {
						body: {},
						method: 'POST',
						url: getBackendEndpoint() + '/v1/auth/getRecoveryMethods'
					})
						.then((methods) => {
							commit('recoveryMethodsFound', methods);
							resolve(true);
						})
						.catch(reject);
				}
			});
		},
		updateUserPayload({ dispatch, state }, params: TypeUpdateUserPayload) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					// only update the app language if it has changed
					if (params.column !== 'app_lang') {
						return resolve(true);
					}

					if (!state.app_lang || state.app_lang == '') {
						return resolve(true);
					}
					if (!state.email || !state.accounts || state.accounts.length < 1 || !state.accounts[0] || !params.value) {
						return resolve(true);
					}
					if (params.value.toLowerCase() == state.app_lang.toLowerCase()) {
						return resolve(true);
					}
					dispatch('sendSignedRequest', {
						body: { column: params.column, value: params.value },
						method: 'POST',
						url: getBackendEndpoint() + '/v1/auth/updateUserPayload'
					})
						.then(() => {
							return resolve(true);
						})
						.catch(reject);
				}, 2000);
			});
		},
		changePassword({ commit, state, dispatch }, params: TypeChangePassword) {
			return new Promise(async (resolve, reject) => {
				try {
					if (state.keystore !== undefined && state.keystore !== null) {
						const newEncryptedSeed = await changePasswordEncryptedSeed(state.encryptedSeed, params.oldPassword, params.newPassword);
						const key = await sha256(state.email.toLowerCase());
						const body = {
							oldKey: key,
							newKey: key,
							oldEmail: state.email,
							newEmail: state.email,
							encryptedSeed: newEncryptedSeed
						};
						await dispatch('sendSignedRequest', {
							body,
							method: 'POST',
							url: getBackendEndpoint() + '/v1/auth/updatePassword'
						});
						commit('seedFound', { encryptedSeed: newEncryptedSeed });
						commit('userFound', { email: state.email, hashedPassword: params.newPassword });
						resolve(true);
					}
				} catch (e) {
					//console.error(e);
					reject(e);
				}
			});
		},
		changeEmail({ commit, state, dispatch }, params: TypeChangeEmail) {
			return new Promise(async (resolve, reject) => {
				try {
					if (state.keystore !== undefined && state.keystore !== null) {
						if (params.password == state.hashedPassword) {
							if (params.twoFa != undefined && params.twoFa > 0) {
								//twoFA was sent
								const resultEmail2fa = await verifyEmailCode(state.email, params.twoFa.toString());
								if (resultEmail2fa.success) {
									const body = {
										oldEmail: state.email,
										newEmail: params.newEmail,
										email2faVerification: params.twoFa
									};
									dispatch('sendSignedRequest', {
										body,
										method: 'POST',
										url: getBackendEndpoint() + '/v1/auth/updateEmail'
									})
										.then(() => {
											commit('userFound', { email: params.newEmail, hashedPassword: state.hashedPassword });
											resolve(true);
										})
										.catch(reject);
								} else {
									reject('Two FA Code is incorrect!');
								}
							} else {
								//twoFA wasn't sent yet, send it with the first request to the new email address
								const body = {
									oldEmail: state.email,
									newEmail: params.newEmail
								};
								dispatch('sendSignedRequest', {
									body,
									method: 'POST',
									url: getBackendEndpoint() + '/v1/auth/updateEmail'
								})
									.then(resolve)
									.catch(reject);
							}
						} else {
							reject('Password is not correct!');
						}
					}
				} catch (e) {
					//console.error(e);
					reject(e);
				}
			});
		},
		changePhoneNumber({ commit, state, dispatch }, params: TypeChangePhoneNumber) {
			return new Promise(async (resolve, reject) => {
				try {
					if (state.keystore !== undefined && state.keystore !== null) {
						if (params.password == state.hashedPassword) {
							if (params.twoFa != undefined && params.twoFa > 0) {
								//twoFA was sent
								const resultEmail2fa = await verifyEmailCode(state.email, params.twoFa.toString());
								if (resultEmail2fa.success) {
									const body = {
										newEmail: state.email,
										newPhoneNumber: params.newPhone,
										email2faVerification: params.twoFa
									};
									dispatch('sendSignedRequest', {
										body,
										method: 'POST',
										url: getBackendEndpoint() + '/v1/auth/updatePhoneNumber'
									})
										.then(() => {
											dispatch('getUserPhoneNumberFromDB', { email: state.email });
											commit('userFound', { email: state.email, phonenumber: params.newPhone, hashedPassword: state.hashedPassword });
											resolve(true);
										})
										.catch(reject);
								} else {
									reject('Two FA Code is incorrect!');
								}
							} else {
								//twoFA wasn't sent yet, send it with the first request to the new email address
								const body = {
									oldEmail: state.email,
									newPhoneNumber: params.newPhone
								};
								dispatch('sendSignedRequest', {
									body,
									method: 'POST',
									url: getBackendEndpoint() + '/v1/auth/updatePhoneNumber'
								})
									.then(resolve)
									.catch(reject);
							}
						} else {
							reject('Phone Number is not correct!');
						}
					}
				} catch (e) {
					//console.error(e);
					reject(e);
				}
			});
		},
		generateQRCode({ dispatch }) {
			return new Promise((resolve, reject) => {
				dispatch('sendSignedRequest', {
					body: {},
					method: 'POST',
					url: getBackendEndpoint() + '/v1/auth/generateAuthenticatorQR'
				})
					.then(resolve)
					.catch(reject);
			});
		},
		change2FAMethods({ dispatch, commit, state }, params: Type2FAUpdateParams) {
			return new Promise((resolve, reject) => {
				dispatch('sendSignedRequest', {
					body: params,
					method: 'POST',
					url: getBackendEndpoint() + '/v1/auth/change2FAMethods'
				})
					.then(async (response) => {
						try {
							if (state.connection && state.connection !== null) {
								const promise = state.connection.promise;

								(await promise).on2FAUpdate('email', params.email);
								(await promise).on2FAUpdate('authenticator', params.authenticator);
							}
						} catch {
							console.error('Error calling on2FAUpdate callback');
						}

						commit('updatePayload', params);
						resolve(response);
					})
					.catch((e) => {
						reject(e);
					});
			});
		},

		sendSignedRequest({ state }, params: TypeRequestParams) {
			return new Promise(async (resolve, reject) => {
				try {
					const body = params.body;
					const key = await sha256(state.email.toLowerCase());
					body.nonce = (await getNonce(key)).nonce;
					const signMessage = JSON.stringify(sortObject(body));
					if (state.keystore != null) {
						const flatSig = await state.keystore.signMessage(signMessage);
						const signature = ethers.utils.splitSignature(flatSig);
						const options: RequestInit = {
							method: params.method,
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json',
								Signature: JSON.stringify(signature),
								key: key
							},
							body: JSON.stringify(body),
							mode: 'cors',
							cache: 'default'
						};

						try {
							const response = await fetch(params.url, options);
							if (!response.ok) {
								reject((await response.json()).error);
							}
							resolve(await response.json());
						} catch (e) {
							reject(e);
						}
					} else {
						reject('Keystore not found, aborting');
					}
				} catch (e) {
					reject(e);
				}
			});
		},
		resetRecoveryMethod({ dispatch, state }, params: TypeResetRecovery) {
			return new Promise((resolve, reject) => {
				dispatch('sendSignedRequest', {
					body: { key: params.key, recoveryTypeId: params.recoveryTypeId },
					method: 'POST',
					url: getBackendEndpoint() + '/v1/auth/resetRecovery'
				})
					.then(() => {
						dispatch('updateRecoveryMethods', { dbUpdate: true }).then(async () => {
							try {
								if (state.connection && state.connection !== null) {
									const promise = state.connection.promise;

									let type;
									if (params.recoveryTypeId == '2') {
										type = 'fb';
									}
									if (params.recoveryTypeId == '3') {
										type = 'google';
									}

									if (params.recoveryTypeId == '5') {
										type = 'vk';
									}

									if (type) {
										(await promise).onRecoveryUpdate(type, false);
									}
								}
							} catch {
								console.error('Error calling onRecoveryUpdate callback');
							}
							resolve(true);
						});
					})
					.catch((e) => {
						reject(e);
					});
			});
		},
		showPrivateKey({ commit, state }, params: TypeShowPhraseKeyVariables) {
			const storedPassword = state.hashedPassword;

			if (storedPassword === params.password) {
				if (state.keystore !== null) {
					const privateKey = state.keystore.privateKey;
					commit('delayedSpinnerMessage', i18n.t('export.PRIVATE_KEY_SUCCESSFUL'));
					commit('updatePrivateKey', { privateKey });
				}
			} else {
				commit('delayedSpinnerMessage', 'Wrong password for private key');
			}
		},
		showPrivateKeyBackground({ state }, params: TypeShowPhraseKeyVariables) {
			const storedPassword = state.hashedPassword;

			if (storedPassword === params.password) {
				if (state.keystore !== null) {
					return state.keystore.privateKey;
				}
			}

			return null;
		},
		exportKeystore({ commit, state }, params: TypeExportPhraseKeyVariables) {
			return new Promise(async (resolve, reject) => {
				const storedPassword = state.hashedPassword;

				if (storedPassword === params.password) {
					if (state.keystore !== null) {
						downloadEncryptedKeystore(await state.keystore.encrypt(params.password), params.account);
						commit('delayedSpinnerMessage', i18n.t('export.KEYSTORE_SUCCESSFUL'));
						commit('keystoreExported');
					}
				} else {
					commit('delayedSpinnerMessage', 'Wrong password for Keystore');
				}
			});
		},
		showSeedPhrase({ commit, state }, params: TypeShowPhraseKeyVariables) {
			const storedPassword = state.hashedPassword;

			if (storedPassword === params.password) {
				if (state.keystore !== null) {
					const seed = state.encryptedSeed;
					if (seed.ciphertext !== undefined && seed.iv !== undefined && seed.salt !== undefined) {
						cryptoDecrypt(params.password, seed.ciphertext, seed.iv, seed.salt).then((mnemonic) => {
							commit('delayedSpinnerMessage', i18n.t('export.SEED_PHRASE_SUCCESSFUL'));
							commit('updateSeedPhrase', { seedPhrase: mnemonic });
						});
					} else {
						commit('delayedSpinnerMessage', 'Wrong seed given');
					}
				}
			} else {
				commit('delayedSpinnerMessage', 'Wrong password for Seed Phrase');
			}
		},
		async showSeedPhraseBackground({ state }, params: TypeShowPhraseKeyVariables) {
			const storedPassword = state.hashedPassword;

			if (storedPassword === params.password) {
				if (state.keystore !== null) {
					const seed = state.encryptedSeed;
					if (seed.ciphertext !== undefined && seed.iv !== undefined && seed.salt !== undefined) {
						const mnemonic = cryptoDecrypt(params.password, seed.ciphertext, seed.iv, seed.salt);

						return mnemonic;
					}
				}
			}

			return null;
		},
		exportSeedPhrase({ commit, state }, params: TypeExportPhraseKeyVariables) {
			const storedPassword = state.hashedPassword;

			if (storedPassword === params.password) {
				if (state.keystore !== null) {
					const seed = state.encryptedSeed;
					if (seed.ciphertext !== undefined && seed.iv !== undefined && seed.salt !== undefined) {
						cryptoDecrypt(params.password, seed.ciphertext, seed.iv, seed.salt).then((mnemonic) => {
							const now = new Date();
							download(mnemonic, 'seed' + '--' + now.toISOString() + '--' + params.account);
							commit('delayedSpinnerMessage', 'Seed Phrase exported successfully');
							commit('seedExported');
						});
					} else {
						commit('delayedSpinnerMessage', 'Wrong seed given');
					}
				}
			} else {
				commit('delayedSpinnerMessage', 'Wrong password for Seed Phrase');
			}
		},
		clearPrivateKey({ commit }) {
			commit('updatePrivateKey', { privateKey: '' });
		},
		clearSeedPhrase({ commit }) {
			commit('updateSeedPhrase', { seedPhrase: '' });
		},
		async loadPassword({ state }) {
			const password = await getSessionStore('password');
			if (password) {
				state.hashedPassword = password;
			}
		},
		deleteWalletAccount({ dispatch, state }, params: TypeShowPhraseKeyVariables) {
			return new Promise(async (resolve, reject) => {
				const storedPassword = state.hashedPassword;

				if (storedPassword === params.password) {
					dispatch('sendSignedRequest', {
						body: {
							email: state.email.toLowerCase()
						},
						method: 'POST',
						url: getBackendEndpoint() + '/v1/auth/deleteAccount'
					})
						.then(() => {
							dispatch('logoutWallet').then(() => {
								resolve(true);
							});
						})
						.catch((e) => {
							reject(e);
						});
				} else {
					reject(new Error('Wrong password for account deletion'));
				}
			});
		},
		setUsersEmail({ commit }, email: string) {
			commit('updateEmail', email);
		},
		async signTransaction({ dispatch, state }, txObj: TransactionObject) {
			const signedTx = await new Promise((resolve, reject) => {
				//see if we are logged in?!
				try {
					if (store.state.keystore !== null) {
						store.state.transactionDetails = txObj;
						store.state.signResponse = null;
						router.push('/signtx').catch(() => undefined);
						const interval = setInterval(() => {
							if (store.state.signResponse) {
								clearInterval(interval);
								if (store.state.signResponse === 'confirm') {
									store.state.signResponse = null;
									if (store.state.keystore !== null) {
										store.state.keystore
											.transfer(txObj)
											.then((txReceipt: any) => {
												resolve(txReceipt);
											})
											.catch(reject);
									} else {
										resolve(null);
									}
								} else {
									store.state.signResponse = null;
									resolve(null);
								}
							}
						}, 500);
					}
				} catch (e) {
					reject(e);
				}
			});
			return signedTx;
		},
	},

	getters: {
		isLoggedIn: (state) => {
			return state.keystore !== undefined && state.keystore !== null;
		},
		twoFaRequired: (state) => {
			return (
				(state.twoFaRequired.email || state.twoFaRequired.authenticator || state.twoFaRequired.needConfirmation) &&
				state.encryptedSeed.ciphertext === undefined
			);
		},
		authStatus: (state) => state.status,
		walletEmail: (state) => state.email,
		walletPhoneNumber: (state) => state.phonenumber,
		cryptoWalletAssets: (state) => state.walletCoins,
		userWalletAssets: (state) => state.walletUserAssets,
		walletUserTransactions: (state) => state.walletUserTransactions,
		hasEncryptedKeystore: (state) => state.encryptedSeed.ciphertext !== undefined
	}
});

/*
initialize the iframe parent connection
*/
if (isIframe()) {
	store.state.connection = connectToParent({
		parentOrigin:
			process.env.NODE_ENV === 'production'
				? /(?=.*morpher.com)^(\/www\.|https:\/\/www\.|https:\/\/)?[a-z 0-9]+([-.]{1}[a-z 0-9]+)*\.[a-z]{2,5}?(\/.*)?$/gm
				: /.*/gm,

		// Methods child is exposing to parent
		methods: {
			async getAccounts() {
				if (store.state.keystore != null) {
					return store.state.accounts;
				} else {
					return [];
				}
			},
			async signTransaction(txObj: any, config: MorpherWalletConfig) {
				if (txObj.eth_balance) {
					store.state.ethBalance = txObj.eth_balance;
				}
				//if (txObj.nonce == undefined) {
				//console.error('No nonce defined, aborting tx signing');
				//}

				const signedTx = await new Promise((resolve, reject) => {
					//see if we are logged in?!
					try {
						if (store.state.keystore !== null) {
							if (config?.confirm_transaction || Number(txObj.chainId) !== 21) {
								if (txObj.amount && !txObj.value) {
									txObj.value = txObj.amount;
								}
								store.state.transactionDetails = txObj;
								store.state.signResponse = null;
								router.push('/signtx').catch(() => undefined);
								const interval = setInterval(() => {
									if (store.state.signResponse) {
										clearInterval(interval);
										if (store.state.signResponse === 'confirm') {
											store.state.signResponse = null;
											if (store.state.keystore !== null) {
												store.state.keystore
													.transfer(txObj)
													.then((txReceipt: any) => {
														resolve(txReceipt);
													})
													.catch(reject);
											} else {
												resolve(null);
											}
										} else {
											store.state.signResponse = null;
											resolve(null);
										}
									}
								}, 500);
							} else {
								store.state.keystore
									.transfer(txObj)
									.then((txReceipt: any) => {
										resolve(txReceipt);
									})
									.catch(reject);
							}
						}
					} catch (e) {
						reject(e);
					}
				});
				return signedTx;
			},
			async signMessage(txObj: any, config: MorpherWalletConfig) {
				const signedTx = await new Promise(async (resolve, reject) => {
					//see if we are logged in?!
					try {
						if (store.state.keystore !== null) {
							if (config?.confirm_message) {
								const Web3Utils = require('web3-utils');
								store.state.messageDetails = Web3Utils.toAscii(txObj.data);
								store.state.signResponse = null;
								router.push('/signmsg').catch(() => undefined);

								const interval = setInterval(async () => {
									if (store.state.signResponse) {
										clearInterval(interval);
										if (store.state.signResponse === 'confirm') {
											store.state.signResponse = null;
											if (store.state.keystore !== null) {
												const signature = await store.state.keystore.signMessage(txObj.data);
												resolve(signature);
											} else {
												resolve(null);
											}
										} else {
											store.state.signResponse = null;
											resolve(null);
										}
									}
								}, 500);
							} else {
								const signature = await store.state.keystore.signMessage(txObj.data);
								resolve(signature);
							}
						}
					} catch (e) {
						reject(e);
					}
				});
				return signedTx;
			},
			showPage(pageName: string) {
				if (pageName) {
					store.state.openPage = pageName;
					return true;
				}

				return false;
			},
			async isLoggedIn() {
				let counter = 0;

				const waitForUnlock = () => {
					return new Promise((resolve) => {
						setTimeout(resolve, 200);
					});
				};
				// wait for the store to finish unlocking if it is in progress
				while (store.state.unlocking && counter < 50) {
					counter += 1;
					// wait for the wallet to finish unlocking
					await waitForUnlock();
				}
				//return 'ok'
				if (store.state.keystore)
					return {
						isLoggedIn: true,
						walletEmail: store.state.email,
						accounts: store.state.accounts
					};
				else return { isLoggedIn: false };
			},
			hasSocialRecoveryMethods() {
				if (store.state.recoveryMethods.length == 1) {
					return false;
				}
				return true;
			},
			logout() {
				store.commit('logout');
			},
			setLanguage(lang?: string): void {
				const supportedLocales: string[] = JSON.parse(process.env.VUE_APP_I18N_SUPPORTED_LOCALE || '') || ['en'];

				if (lang && supportedLocales.includes(lang)) {
					i18n.locale = lang;
					document.querySelector('html')?.setAttribute('lang', lang);
					if (lang === 'ar') document.querySelector('html')?.setAttribute('dir', 'rtl');
					else document.querySelector('html')?.setAttribute('dir', '');
					Cookie.set('locale', lang);

					if (store.state.keystore) {
						store.dispatch('updateUserPayload', { column: 'app_lang', value: lang });
					}
				}
			}
		}
	});
}

export default store;
