import { ethers } from 'ethers';


export async function getPrice(address: string) {

    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/bdd9a9d596d0418e8df81be7136dfc4d");
    const aggregatorV3InterfaceABI = [
        {
            inputs: [],
            name: 'decimals',
            outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'description',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
            name: 'getRoundData',
            outputs: [
                { internalType: 'uint80', name: 'roundId', type: 'uint80' },
                { internalType: 'int256', name: 'answer', type: 'int256' },
                { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
                { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
                { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'latestRoundData',
            outputs: [
                { internalType: 'uint80', name: 'roundId', type: 'uint80' },
                { internalType: 'int256', name: 'answer', type: 'int256' },
                { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
                { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
                { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'version',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function'
        }
    ];
    const addr = address;
    const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider);
    const roundData = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();
    return Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));
}
