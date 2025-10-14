import { ContractFactory } from "ethers";
import { abi as rpgAbi } from "@/lib/abi/rpg.json";
import * as rpgBytes from "@/lib/bytes/rpg.json";
import { Signer } from "ethers";
import { parseEther, Addressable } from "ethers";
import { config } from "@/config";
import { Hasher__factory, Rpg__factory } from "../../../typechain";
export class RPGService {

  /**
   * 
   * @param signer The signer of the game
   * @param move The move selected by the player
   * @param salt The salt entered by the player
   * @param stakeAmount The amount of ETH to stake to play the game
   * @param player2Address The wallet address of opponent
   * @returns returns the contract address of the newly created game
   */
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

  /**
   * 
   * @param signer The signer of the game
   * @param rpgAddress The address of the game contract to get the last action from
   * @returns retuns the timestamp at which last action takes place
   */
  static async getRPGGameLastAction(
    signer: Signer | undefined,
    rpgAddress: string
  ): Promise<string> {
    if (!signer) throw new Error("Wallet not connected");
    const contract = Rpg__factory.connect(rpgAddress, signer);
    const lastAction = await contract.lastAction();
    return lastAction.toString();
  }

  /**
   * 
   * @param address The address of the game contract 
   * @param move The 
   * @param signer 
   * @param amount 
   * @returns 
   */
  static async move(
    address: string,
    move: string,
    signer: Signer | undefined,
    amount: string
  ) {
    if (!signer) throw new Error("Wallet not connected");
    const contract = Rpg__factory.connect(address, signer);
    let estimatedGas: bigint;
    try {
      estimatedGas = await contract.getFunction("play").estimateGas(move);
    } catch {
      estimatedGas = BigInt(config.defaultGasLimit);
    }
    const overrides = {
      gasLimit: estimatedGas + BigInt(config.defaultGasLimit),
      value: amount,
    };
    return await contract.play(move, overrides);
  }

  static async getHash(
    move: string,
    salt: string,
    signer: Signer
  ): Promise<string> {
    const contract = Hasher__factory.connect(config.hasherAddress, signer);
    const hash = await contract.hash(move, salt);

    return hash;
  }

  static async solve(
    address: string,
    signer: Signer | undefined,
    move: string,
    salt: string
  ) {
    if (!signer) throw new Error("Wallet not connected");

    const contract = Rpg__factory.connect(address, signer);
    let estimatedGas: bigint;
    try {
      estimatedGas = await contract
        .getFunction("solve")
        .estimateGas(move, salt);
    } catch {
      estimatedGas = BigInt(config.defaultGasLimit);
    }
    const overrides = {
      gasLimit: estimatedGas + BigInt(config.defaultGasLimit),
    };
    return await contract.solve(move, salt, overrides);
  }

  static async callJ2TimeOut(address: string, signer: Signer | undefined) {
    if (!signer) throw new Error("Wallet not connected");

    const contract = Rpg__factory.connect(address, signer);
    let estimatedGas: bigint;
    try {
      estimatedGas = await contract.getFunction("j2Timeout").estimateGas();
    } catch {
      estimatedGas = BigInt(config.defaultGasLimit);
    }
    const overrides = {
      gasLimit: estimatedGas + BigInt(config.defaultGasLimit),
    };
    return await contract.j2Timeout(overrides);
  }

  static async callJ1TimeOut(address: string, signer: Signer | undefined) {
    if (!signer) throw new Error("Wallet not connected");

    const contract = Rpg__factory.connect(address, signer);
    let estimatedGas: bigint;
    try {
      estimatedGas = await contract.getFunction("j1Timeout").estimateGas();
    } catch {
      estimatedGas = BigInt(config.defaultGasLimit);
    }
    const overrides = {
      gasLimit: estimatedGas + BigInt(config.defaultGasLimit),
    };
    return await contract.j1Timeout(overrides);
  }
}
