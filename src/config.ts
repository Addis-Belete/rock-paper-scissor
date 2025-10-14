type Config = {
  baseUrl: string;
  mongoDBUri: string;
  hasherAddress: string;
  defaultGasLimit: string
};

export const config: Config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  mongoDBUri:
    process.env.MONGO_DB_URI ||
    "mongodb://localhost:27017/?directConnection=true",
  hasherAddress: "0x8053bB097424eDF8F151516c3114E6d3e054CC62", // deployed on sepolia
  defaultGasLimit: '100000'
};
