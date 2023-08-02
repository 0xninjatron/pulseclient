// sepolia
// const chainId = "11155111";
// const chainExplorer = "https://sepolia.etherscan.io/tx/";
// const nftContractAddress = "0xb2857A07097842B4d7703385f50658FFc1dF9d45";
// const marketplaceAddress = "0x42771B6EeAC34F92a92930c3Df120cbC1913e011";

// Arbitrum Goerli (Testnet)
// const chainId = "421613";
// const chainExplorer = "https://goerli.arbiscan.io/";
// const chainExplorerTx = chainExplorer + "tx/";
// const chainExplorerAddress = chainExplorer + "address/";
// const nftContractAddress = "0x9F4E86d7e3bA52B828372e3b8DC3a46f962DA147";
// const marketplaceAddress = "0xC48db30CDdA7B2971F0089B2F1cCDDd1B06E677A";

// Arbitrum One
const chainId = "42161";
const chainExplorer = "https://arbiscan.io/";
const chainExplorerTx = chainExplorer + "tx/";
const chainExplorerAddress = chainExplorer + "address/";
const nftContractAddress = "0x69B6760b50e7301a9f260e8d2647C7Ca52E0B966";
const marketplaceAddress = "0xAefad12C9a8ABC8dF00Ca265ECd6Da85E928025a";


const WORKER_SERVICE_URL = "https://pulse-worker-ipfs.pulseworkers.workers.dev/";//"http://127.0.0.1:8787/";

const autoSaleFactor = 5;
const MAX_SECONDARY_IMAGES = 10;

const CLOUDINARY_CLOUDNAME = "deibsi4eu";

export { CLOUDINARY_CLOUDNAME, MAX_SECONDARY_IMAGES, WORKER_SERVICE_URL, autoSaleFactor, chainExplorer,chainExplorerTx, chainExplorerAddress,chainId, nftContractAddress, marketplaceAddress};
