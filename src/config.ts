type Config = {
  etherscanApiKey: string | undefined;
  rpcUrl: string | undefined;
  baseUrl: string;
  multicallAddress: string;
  mongoDBUri: string;
  etherscanBaseUrl: string;
  offset: string;
};

export const config: Config = {
  etherscanApiKey: process.env.ETHERSCAN_API_KEY,
  rpcUrl: process.env.RPC_URL,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11", // Mainnet & most EVM chains
  mongoDBUri:
    process.env.MONGO_DB_URI ||
    "mongodb://localhost:27018/?directConnection=true",
  etherscanBaseUrl: "https://api.etherscan.io/api",
  offset: process.env.OFFSET || "10000",
};
