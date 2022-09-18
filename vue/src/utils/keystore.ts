import Accounts from 'web3-eth-accounts';
import { TypeCreatedKeystore, TypeEncryptedSeed, TransactionObject, TransactionReceipt } from '@/types/global-types';

import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import { cryptoDecrypt, cryptoEncrypt } from '../utils/cryptoFunctions';

import { ethers } from 'ethers';
// import * as zksync from 'zksync';
import * as zksync from "zksync-web3";
import { changePubKey } from '../utils/zksync';
import { arrayify, hexlify } from '@ethersproject/bytes';
import { sign_musig, privateKeyFromSeed } from 'zksync-crypto';

function getPrivateKeyFromMnemonic(mnemonic: string, index: number) {
	const seed = mnemonicToSeedSync(mnemonic);
	const hdwallet = hdkey.fromMasterSeed(seed);
	const walletHdPath = "m/44'/60'/0'/0/";

	const wallet = hdwallet.derivePath(walletHdPath + index).getWallet();
	// let address = "0x" + wallet.getAddress().toString("hex");
	const privateKey = wallet.getPrivateKey().toString('hex');
	return privateKey;
}

export function getKeystore(password: string, encryptedSeedObject: TypeEncryptedSeed, accountIndex: number): Promise<TypeCreatedKeystore> {
	return new Promise(async (resolve, reject) => {
		try {
			//const syncProvider = await zksync.getDefaultProvider('mainnet');
			const syncProvider = new zksync.Provider("https://zksync2-testnet.zksync.dev");
			const ethProvider = ethers.getDefaultProvider("rinkeby");

			let mnemonic: string;
			if (encryptedSeedObject.ciphertext == undefined || encryptedSeedObject.iv == undefined || encryptedSeedObject.salt == undefined) {
				mnemonic = generateMnemonic();
				encryptedSeedObject = await cryptoEncrypt(password, mnemonic);
			} else {
				//const encryptedSeedObject = JSON.parse(encryptedSeedPhrase);
				mnemonic = await cryptoDecrypt(password, encryptedSeedObject.ciphertext, encryptedSeedObject.iv, encryptedSeedObject.salt);
			}

			if (accountIndex == undefined) {
				accountIndex = 1;
			}

			const privateKey = getPrivateKeyFromMnemonic(mnemonic, accountIndex);
			const ethWallet = new ethers.Wallet(privateKey);
			const syncWallet = new zksync.Wallet(privateKey, syncProvider, ethProvider);
			resolve({ encryptedSeed: encryptedSeedObject, keystore: syncWallet });
		} catch (err) {
			reject(err);
		}
	});
}