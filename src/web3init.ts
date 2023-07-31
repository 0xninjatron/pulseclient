import Web3 from "web3";
import { chainId } from "./constant";

const provider = window.ethereum;
const web3 = new Web3(provider);

async function initWeb3() {
  if (provider) {
    try {
      const hexChainId = `0x${Number(chainId).toString(16)}`;
      // Request user to switch to Ethereum mainnet (chainId '0x1')
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }], //mainnet 0x1, sepolia is 0xaa36a7
      });
    } catch (error) {
      console.error(error);
    }
  }
  return web3;
}

const waitForTransactionReceipt = async (txHash: string) => {
  let receipt = null;
  let count = 0;

  while (receipt == null) {
    try {
      // Fetch the transaction receipt
      receipt = await web3.eth.getTransactionReceipt(txHash);

      if (count % 5 == 0) {
        console.log(`Attempt ${count}:`, receipt);
      }
      count++;

      // If receipt is still null, wait for 0.2 seconds before the next attempt
      if (receipt == null) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (err) {
      console.log('Error while fetching the transaction receipt: ', err);
      return;
    }
  }

  console.log('Final Receipt: ', receipt);
  return receipt;
};




initWeb3();

export { web3, waitForTransactionReceipt };
