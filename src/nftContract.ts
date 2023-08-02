import { AbiItem } from "web3-utils";
import PNFTABI from "./abi/PNFT.json";
import { web3 } from "./web3init";
import { nftContractAddress } from "./constant";
import { BigNumber } from "@ethersproject/bignumber";

// Declare the type for the ABI
const PNFTAbi: AbiItem[] = PNFTABI as AbiItem[];
const nftContract = new web3.eth.Contract(PNFTAbi, nftContractAddress);

export async function fetchTokenURI(tokenId: number) {
  let tokenURI = await nftContract.methods.tokenURI(tokenId).call();
  console.log("tokenURI: ", tokenURI);
  const response = await fetch(tokenURI);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("returning data: ", data);
  return data;
}

export async function getRoyaltyInfo(tokenId: number, salePrice: BigNumber) {
  console.log("salePrice: ", salePrice);
  const result = await nftContract.methods
    .royaltyInfo(tokenId, salePrice)
    .call();
  console.log("result: ", result);
  // const royaltyRecipient = result[0];
  const royaltyAmount = result[1];
  return { royaltyAmount };
}

export async function getName(): Promise<string> {
  const result: string = await nftContract.methods.name().call();
  return result;
}

/**
 *
 * @param data
 * @param imageKey
 * @returns
 */
export const checkImageField = (data: any, imageKey: string): string | null => {
  if (data[imageKey] && typeof data[imageKey] === "string") {
    return data[imageKey];
  }
  return null;
};

export const ownerOf = async (tokenId: number): Promise<string> => {
  return await nftContract.methods.ownerOf(tokenId).call();
};

/**
 * Calls PNFT::setImageUrlHist
 *
 * @param userAddress
 * @returns
 */
export const setImageUrlHist = async (
  tokenId: number,
  imageURL: string
): Promise<string> => {
  try {
    const accounts = await web3.eth.getAccounts();
    const txn = nftContract.methods.setImageUrlHist(tokenId, imageURL).send({
      from: accounts[0],
    });

    // // Create a promise that resolves with the transaction hash
    const txnHashPromise = new Promise<string>((resolve, reject) => {
      txn.once("transactionHash", resolve);
      txn.once("error", reject);
    });

    return txnHashPromise;
  } catch (error) {
    console.error(`Failed to set token URI for tokenId ${tokenId}: ${error}`);
    throw error; // you can also throw the error further if you want to handle it in the caller function.
  }
};

export const setOtherImageUrls = async (
  tokenId: number,
  imageUrls: string[]
): Promise<string> => {
  try {
    const accounts = await web3.eth.getAccounts();
    const txn = nftContract.methods.setOtherImageUrls(tokenId, imageUrls).send({
      from: accounts[0],
    });

    // Create a promise that resolves with the transaction hash
    const txnHashPromise = new Promise<string>((resolve, reject) => {
      txn.once("transactionHash", resolve);
      txn.once("error", reject);
    });

    return txnHashPromise;
  } catch (error) {
    console.error(
      `Failed to set other image URLs for tokenId ${tokenId}: ${error}`
    );
    throw error;
  }
};

/**
 * Calls IERC721Enumerable::tokenOfOwnerByIndex
 *
 * @param userAddress
 * @returns
 */
export const fetchUserTokenIds = async (userAddress: string) => {
  const PNFTs = [];

  let maxIndex = await nftContract.methods.balanceOf(userAddress).call();
  let index = 0;
  while (index < maxIndex) {
    try {
      const tokenId = await nftContract.methods
        .tokenOfOwnerByIndex(userAddress, index)
        .call();
      if (!tokenId) {
        break;
      }

      const tokenURI = await fetchTokenURI(tokenId);

      const imageURL = checkImageField(tokenURI, "image0");

      PNFTs.push({
        contractAddress: nftContractAddress,
        name: tokenURI.name,
        tokenId: tokenId,
        imageURL: imageURL,
        imageURLList: null,
        isOwner: true,
        saleMetadata: null,
        saleAmount: null,
        sellerAddress: null,
      });

      index++;
    } catch (error) {
      console.error("Error calling tokenOfOwnerByIndex:", error);
      break;
    }
  }

  return PNFTs;
};

export const checkIsApprovedForAll = async (
  operator: string
): Promise<boolean> => {
  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const rval = await nftContract.methods
      .isApprovedForAll(account, operator)
      .call();
    console.log("isApprovedForAll: ", rval);
    return rval;
  } catch (error) {
    console.error(`Failed to check if account is approved for all: ${error}`);
    throw error;
  }
};

export const setApprovalForAll = async (
  operator: string,
  approved: boolean
): Promise<string> => {
  try {
    const accounts = await web3.eth.getAccounts();
    const txn = nftContract.methods.setApprovalForAll(operator, approved).send({
      from: accounts[0],
    });

    // // Create a promise that resolves with the transaction hash
    const txnHashPromise = new Promise<string>((resolve, reject) => {
      txn.once("transactionHash", resolve);
      txn.once("error", reject);
    });
    return txnHashPromise;
  } catch (error) {
    console.error(`Failed to set approval for all: ${error}`);
    throw error;
  }
};

export { nftContractAddress, nftContract, web3 };
