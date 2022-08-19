import { assets } from '../types/assets';
import Vue from 'vue';
import { Commit } from 'vuex';
import { getPrice } from './fetchCoins';
const getCoinGeckoApi = () => {
	return (
		process.env.VUE_APP_COINGECKO_API ||
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
	);
};

const userAssetsFetching = async (user_assets: Array<any>, commit: Commit) => {
	let all_user_assets: Array<any>;
	let percentage_change_final_data: Array<any>;

	await Vue.axios
		.get(getCoinGeckoApi())
		.then(async (response) => {
			const { data } = response;

			const allData = [...data].map((coin) => {
				return new Promise((resolve) => {
					return resolve({
						id: coin.id,
						change: coin.price_change_percentage_24h
					});
				});
			});
			const all_assets_data: Array<any> = await Promise.all(allData);
			const ids = process.env.VUE_APP_COIN_IDS || ['bitcoin', 'ethereum', 'dai', 'usd-coin', 'binancecoin'];
			percentage_change_final_data = all_assets_data.filter((coin: { id: string }) => ids.includes(coin.id));

			all_user_assets = assets.map((el: { id: any }) => ({
				...el,
				change: percentage_change_final_data.find((pc: { id: any }) => pc.id === el.id)?.change
			}));
			const final_user_assets = JSON.parse(JSON.stringify(all_user_assets));

			const walletsAssets_data = [...final_user_assets].map(async (asset) => {
				const assetValue = await getPrice(asset.addr);
				return new Promise((resolve) => {
					return resolve({
						id: asset.id,
						addr: asset.addr,
						name: asset.name,
						symbol: asset.symbol,
						bal: asset.bal,
						daychange: asset.change.toFixed(3),
						img: asset.img,
						value: Math.round(assetValue * 1e2) / 1e2
					});
				});
			});

			const user_assets_final = await Promise.all(walletsAssets_data);
			user_assets = user_assets_final;
		})
		.catch((error) => {
			commit('loading', error.message);
			window.console.log(error);
		});
	const result = await JSON.parse(JSON.stringify(user_assets));
	return result;
};

export { userAssetsFetching };
