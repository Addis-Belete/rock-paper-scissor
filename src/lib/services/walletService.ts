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

  /**
   * @notice Connects the user's wallet to the application.
   * @dev Requests account access, switches to Sepolia network, and initializes the signer and account address.
   * @throws If MetaMask is not found or connection fails.
   */
  async connect(): Promise<void> {
    if (!this.provider) throw new Error("MetaMask not found.");

    await this.switchToSepolia();

    await window.ethereum.request({ method: "eth_requestAccounts" });
    this.signer = await this.provider.getSigner();
    this.account = await this.signer.getAddress();
  }

  /**
   * @notice Disconnects the wallet from the application.
   * @dev Clears the signer and account information from the service.
   */
  async disconnect() {
    this.signer = undefined;
    this.account = undefined;
  }

  /**
   * @notice Retrieves the ETH balance for the specified wallet address.
   * @dev Queries the provider for the balance and returns it as a string.
   * @param address The wallet address to check the balance for.
   * @return The ETH balance as a string, or "0" if address is undefined.
   */
  async getBalance(address: string | undefined): Promise<string> {
    if (!this.provider) throw new Error("Provider not initialized.");
    if (!address) return "0";
    const balance = await this.provider.getBalance(address);
    return balance.toString();
  }

  /**
   * @notice Switches the connected wallet to the Sepolia test network.
   * @dev Requests MetaMask to switch to Sepolia, and adds the network if not already present.
   * @throws If MetaMask is not available or the network switch fails for reasons other than missing network.
   */
  private async switchToSepolia(): Promise<void> {
    const sepoliaChainId = "0xaa36a7"; // 11155111 in hex

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: sepoliaChainId }],
      });
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

  /**
   * @notice Returns the current wallet signer instance.
   * @dev Provides access to the Signer for signing transactions and messages.
   * @return The wallet Signer object, or undefined if not connected.
   */
  getSigner(): Signer | undefined {
    return this.signer;
  }

  /**
   * @notice Signs a message with the user's wallet to generate a session-specific signature.
   * @dev Stores the signature in session storage for use in encrypting and decrypting moves and salt.
   * @return The wallet signature string.
   */
  async signMessage(): Promise<string> {
    if (!this.signer) throw new Error("Signer not initialized.");
    const signature = await this.signer.signMessage(SIGN_MESSAGE);
    sessionStorage.setItem("rpgGameSingature", signature);
    return signature;
  }

  /**
   * @notice Retrieves the wallet signature used for encrypting and decrypting moves and salt.
   * @dev Fetches the signature from session storage if available.
   * @return The wallet signature string, or null if not found.
   */
  getSignature(): string | null {
    return sessionStorage.getItem("rpgGameSingature");
  }
}

export const walletService = WalletService.getInstance();
