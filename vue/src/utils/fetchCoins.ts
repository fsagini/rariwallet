import { aggregatorV3InterfaceABI } from '@/abis/aggregatorV3InterfaceABI';
import { ethers } from 'ethers';
export async function getPrice(address: string) {
	const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/bdd9a9d596d0418e8df81be7136dfc4d');
	const addr = address;
	const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider);
	const roundData = await priceFeed.latestRoundData();
	const decimals = await priceFeed.decimals();
	return Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));
}
