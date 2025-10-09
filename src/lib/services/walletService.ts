"use client";

import { ethers } from "ethers";
import { Signer, BrowserProvider } from "ethers";

class WalletService {
  private static instance: WalletService;
  private provider?: BrowserProvider;
  private signer?: Signer;
  account?: string

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
    this.account = await this.signer.getAddress()
  }

  async disconnect() {
    this.signer = undefined;
    this.account = undefined
  }

  // Get balance
  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error("Provider not initialized.");
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
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


}

export const walletService = WalletService.getInstance();
