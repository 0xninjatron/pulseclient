import { BigNumber } from "@ethersproject/bignumber";

export type PNFT = {
  contractAddress: string;
  name: string;
  tokenId: number;
  imageURL: string | null;
  imageURLList: string[];
  isOwner: boolean;  
  sellerAddress: string | null;
  saleAmount: BigNumber | null;
};


export type TxData = {
  from: string;
  to: string;
  data: string;
  value?: string;
};
