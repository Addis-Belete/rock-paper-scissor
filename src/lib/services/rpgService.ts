import { ContractFactory } from "ethers";
import { abi as rpgAbi } from "@/lib/abi/rpg.json";
import { abi as hasherAbi } from "@/lib/abi/hasher.json";
import * as rpgBytes from "@/lib/bytes/rpg.json";
import { Signer } from "ethers";
import { Contract, parseEther, Addressable } from "ethers";
import { config } from "@/config";

export class RPGService {
  static async playNewRPGGame(
    signer: Signer | undefined,
    move: string,
    salt: string,
    stakeAmount: string,
    player2Address: string
  ): Promise<string | Addressable> {
    if (!signer) throw new Error("wallet not connected");

    const contractFactory = new ContractFactory(rpgAbi, rpgBytes, signer);

    const hash = await this.getHash(move, salt, signer);

    const rpg = await contractFactory.deploy(hash, player2Address, {
      value: parseEther(stakeAmount),
    });

    await rpg.waitForDeployment();

    return rpg.target;
  }

  static async getRPGGameLastAction(
    signer: Signer | undefined,
    rpgAddress: string
  ): Promise<string> {
    if (!signer) throw new Error("Wallet not connected");
    const contract = new Contract(rpgAddress, rpgAbi, signer);
    const lastAction = await contract.lastAction();
    return lastAction;
  }

  static async move(address: string, move: string, signer: Signer | undefined, amount: string) {
    if (!signer) throw new Error("Wallet not connected");
    const contract = new Contract(address, rpgAbi, signer);
    return await contract.play(move, {value: amount});
  }

  static async getHash(
    move: string,
    salt: string,
    signer: Signer
  ): Promise<string> {
    const contract = new Contract(config.hasherAddress, hasherAbi, signer);
    const hash = await contract.hash(move, salt);

    return hash;
  }

  static async solve() {}

  static async callTimeOut() {}
}
