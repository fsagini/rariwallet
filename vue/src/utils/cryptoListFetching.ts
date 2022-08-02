import { addresses } from '../types/adresses';
import Vue from 'vue';
import { Commit } from 'vuex';
import { getPrice } from './fetchCoins';
import { numberWithCommas } from './Commaseparator';

const getCoinGeckoApi = () => {
	return (
		process.env.VUE_APP_COINGECKO_API ||
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
	);
};

const fetchCryptoList = async (rari_supported_coins: Array<any>, commit: Commit) => {
	let rate: any;
	let coins_supported_data: Array<any>;
	let percentage_change_final_data: Array<any>;

	// const myHeaders = new Headers();
	// myHeaders.append('apikey', 'xXHV07ckmqDKWbX2rbe3B42hZIerttDS');
	// await fetch('https://api.apilayer.com/fixer/latest?symbols=KES&base=USD', {
	// 	method: 'GET',
	// 	redirect: 'follow',
	// 	headers: myHeaders
	// })
	// 	.then((response) => response.text())
	// 	.then((result) => {
	// 		const kerate: any = JSON.parse(result);
	// 		rate = kerate.rates?.KES.toFixed(2);
	// 	});

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
			const all_data: Array<any> = await Promise.all(allData);
			const ids = process.env.VUE_APP_COIN_IDS || ['bitcoin', 'ethereum', 'dai', 'usd-coin', 'binancecoin'];
			percentage_change_final_data = all_data.filter((coin: { id: string }) => ids.includes(coin.id));

			coins_supported_data = addresses.map((el: { id: any }) => ({
				...el,
				change: percentage_change_final_data.find((pc: { id: any }) => pc.id === el.id)?.change
			}));
			const final_coins_supported_data = JSON.parse(JSON.stringify(coins_supported_data));

			const coins_data = [...final_coins_supported_data].map(async (coin) => {
				const coinValue = await getPrice(coin.addr);
				return new Promise((resolve) => {
					return resolve({
						id: coin.id,
						addr: coin.addr,
						name: coin.name,
						symbol: coin.symbol,
						change: coin.change.toFixed(2),
						img: coin.img,
						price: numberWithCommas(coinValue)
					});
				});
			});

			const coins_data_final = await Promise.all(coins_data);
			rari_supported_coins = coins_data_final;
		})
		.catch((error) => {
			commit('loading', error.message);
			window.console.log(error);
		});
	return rari_supported_coins;
};

export { fetchCryptoList };
