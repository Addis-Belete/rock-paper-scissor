import { ContractFactory } from "ethers";
import { abi } from "@/lib/abi/rpg.json";
import * as rpgBytes from "@/lib/bytes/rpg.json";
import { Signer } from "ethers";
import { Contract } from "ethers";
export class RPGService {
  static async playNewRPGGame(signer: Signer, move: string, salt: string) {
    const contract = new ContractFactory(abi, rpgBytes, signer);
    const rpg = await contract.deploy(move, salt);
    await rpg.waitForDeployment();
  }

  static async move(address: string, move: string, signer: Signer) {
    const contract = new Contract(address, abi, signer);

    //return await contract.connect(signer).move();
  }

  static async solve() {}

  static async callTimeOut() {}
}
