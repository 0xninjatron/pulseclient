import { AbiItem } from "web3-utils";
import PMarketplaceABI from "./abi/PMarketplace.json";
import { marketplaceAddress } from "./constant";
import { ethers } from "ethers";
import { web3 } from "./web3init";

// Declare the type for the ABI
const PMarketplaceAbi: AbiItem[] = PMarketplaceABI as AbiItem[];
const marketplace = new web3.eth.Contract(
  PMarketplaceAbi,
  marketplaceAddress
);

export const listNFT = async (
  tokenId: number,
  salePrice: ethers.BigNumber
): Promise<string> => {
  try {
    const accounts = await web3.eth.getAccounts();
    const txn = marketplace.methods.listNFT(tokenId, salePrice).send({
      from: accounts[0],
    });
    
    // Create a promise that resolves with the transaction hash
    const txnHashPromise = new Promise<string>((resolve, reject) => {
      txn.once("transactionHash", resolve);
      txn.once("error", reject);
    });

    return txnHashPromise;
  } catch (error) {
    console.error("An error occurred while listing the NFT:", error);
    throw error;
  }
};

export const getNFTListPrice = async (tokenId: number): Promise<ethers.BigNumber> => {
  return await marketplace.methods.tokenPrices(tokenId).call();
};

export const buyNFT = async (
  tokenId: number,
  value: ethers.BigNumber,
  autoSalePrice: ethers.BigNumber,
): Promise<string> => {
  try {
    const accounts = await web3.eth.getAccounts();
    const txn = marketplace.methods
      .buyNFT(tokenId, autoSalePrice)
      .send({ value, from: accounts[0] });
    
    const txnHashPromise = new Promise<string>((resolve, reject) => {
      txn.once("transactionHash", resolve);
      txn.once("error", reject);
    });

    return txnHashPromise;
  } catch (error) {
    console.error("An error occurred while listing the NFT:", error);
    throw error;
  }
};
