// @/vtoastify.d.ts

declare module '*.vue' {
	import Vue from 'vue';
	export default Vue;
}

declare module '@metamask/jazzicon';
declare module 'vue-toastify';
declare module '*.json' {
	const value: any;
	export default value;
}
