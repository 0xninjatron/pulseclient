import { ethers } from "ethers";

export function shortenAddress(address: string, digits = 4) {
  if (!address) return "";
  // Ensure the address is valid
  const shortAddress = ethers.utils.getAddress(address);
  // Get the substring according to the number of digits
  return `${shortAddress.substring(0, digits + 2)}...${shortAddress.slice(
    -digits
  )}`;
}

export function shortenTxnHash(txHash: string, digits = 4) {
  if (!txHash) return "";
  if (txHash.length !== 66) {
    // A transaction hash should be 66 characters long including '0x'
    throw new Error("Invalid Ethereum transaction hash");
  }
  // Shorten the transaction hash
  return `${txHash.substring(0, digits + 2)}...${txHash.slice(-digits)}`;
}

// Great comparison of different gateways: https://ipfs.github.io/public-gateway-checker/
export const replaceIpfsPrefix = (str: string): string => {
  if (str.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${str.replace("ipfs://", "")}`;
  }
  return str;
};
