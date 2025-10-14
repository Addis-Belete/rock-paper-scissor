"use client";

import { ethers } from "ethers";
import { Signer, BrowserProvider } from "ethers";

const SIGN_MESSAGE =
  "RPG Game: Sign once to securely encrypt and decrypt your moves and salt securly for this session.";

class WalletService {
  private static instance: WalletService;
  private provider?: BrowserProvider;
  private signer?: Signer;
  account?: string;

  private constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      console.warn("MetaMask not detected.");
    }
  }

  // Singleton access
  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  // Connect wallet
  async connect(): Promise<void> {
    if (!this.provider) throw new Error("MetaMask not found.");

    await this.switchToSepolia();

    await window.ethereum.request({ method: "eth_requestAccounts" });
    this.signer = await this.provider.getSigner();
    this.account = await this.signer.getAddress();
  }

  async disconnect() {
    this.signer = undefined;
    this.account = undefined;
  }

  // Get balance
  async getBalance(address: string | undefined): Promise<string> {
    if (!this.provider) throw new Error("Provider not initialized.");
    if (!address) return "0";
    const balance = await this.provider.getBalance(address);
    return balance.toString();
  }

  // Sepolia is supported
  private async switchToSepolia(): Promise<void> {
    const sepoliaChainId = "0xaa36a7"; // 11155111 in hex

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: sepoliaChainId }],
      });
      console.log("Switched to Sepolia network");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // If Sepolia is not added to MetaMask
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: sepoliaChainId,
              chainName: "Sepolia Test Network",
              nativeCurrency: {
                name: "Sepolia Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.infura.io/v3/"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        console.log("Added Sepolia to MetaMask");
      } else {
        throw error;
      }
    }
  }
  getSigner(): Signer | undefined {
    return this.signer;
  }

  async signMessage(): Promise<string> {
    if (!this.signer) throw new Error("Signer not initialized.");
    const signature = await this.signer.signMessage(SIGN_MESSAGE);
    sessionStorage.setItem("rpgGameSingature", signature);
    return signature
  }

  getSignature(): string | null {
    return sessionStorage.getItem("rpgGameSingature");
  }
}

export const walletService = WalletService.getInstance();
