import { ethers } from "ethers";

export type PNFT = {
  contractAddress: string;
  name: string;
  tokenId: number;
  imageURL: string | null;
  imageURLList: string[];
  isOwner: boolean;  
  sellerAddress: string | null;
  saleAmount: ethers.BigNumber | null;
};


export type TxData = {
  from: string;
  to: string;
  data: string;
  value?: string;
};
