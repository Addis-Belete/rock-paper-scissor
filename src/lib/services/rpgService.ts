import { ContractFactory } from "ethers";
import { abi as rpgAbi } from "@/lib/abi/rpg.json";
import * as rpgBytes from "@/lib/bytes/rpg.json";
import { Signer } from "ethers";
import { parseEther, Addressable } from "ethers";
import { config } from "@/config";
import { Hasher__factory, Rpg__factory } from "../../../typechain";
export class RPGService {
  /**
   * @notice Deploys a new RPG game contract and commits the player's move using a hash.
   * @dev Uses the Hasher contract to hash the move and salt, then deploys the RPG contract with the hash and opponent's address. Throws if wallet is not connected.
   * @param signer The wallet signer used to deploy the contract.
   * @param move The move selected by the player.
   * @param salt The secret salt entered by the player.
   * @param stakeAmount The amount of ETH to stake to play the game.
   * @param player2Address The wallet address of the opponent.
   * @return The contract address of the newly created RPG game.
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
   * @notice Retrieves the timestamp of the last action taken in the RPG game contract.
   * @dev Throws if wallet is not connected.
   * @param signer The wallet signer used to interact with the contract.
   * @param rpgAddress The address of the RPG game contract.
   * @return The timestamp of the last action as a string.
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
   * @notice Sends the player's move to the RPG game contract.
   * @dev Estimates gas for the play transaction and applies a buffer. Throws if wallet is not connected.
   * @param address The address of the RPG game contract.
   * @param move The move selected by the player (e.g., "rock", "paper", or "scissors").
   * @param signer The wallet signer used to send the transaction.
   * @param amount The amount of ETH to stake for the move.
   * @return The transaction response from the contract's play function.
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

  /**
   * @notice Computes the hash of the player's move and salt for commitment.
   * @dev Uses the Hasher contract to generate a hash for the move and salt.
   * @param move The move selected by the player.
   * @param salt The secret salt entered by the player.
   * @param signer The wallet signer used to interact with the Hasher contract.
   * @return The hash string representing the committed move and salt.
   */
  static async getHash(
    move: string,
    salt: string,
    signer: Signer
  ): Promise<string> {
    const contract = Hasher__factory.connect(config.hasherAddress, signer);
    const hash = await contract.hash(move, salt);

    return hash;
  }

  /**
   * @notice Reveals the player's move and salt to resolve the game outcome.
   * @dev Estimates gas for the solve transaction and applies a buffer. Throws if wallet is not connected.
   * @param address The address of the RPG game contract.
   * @param signer The wallet signer used to send the transaction.
   * @param move The move to reveal (e.g., "rock", "paper", or "scissors").
   * @param salt The secret salt used during commitment.
   * @return The transaction response from the contract's solve function.
   */
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

  /**
   * @notice Calls the j2Timeout function to trigger a timeout for player 2 if they have not acted in time.
   * @dev Estimates gas for the j2Timeout transaction and applies a buffer. Throws if wallet is not connected.
   * @param address The address of the RPG game contract.
   * @param signer The wallet signer used to send the transaction.
   * @return The transaction response from the contract's j2Timeout function.
   */
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

  /**
   * @notice Calls the j1Timeout function to trigger a timeout for player 1 if they have not acted in time.
   * @dev Estimates gas for the j1Timeout transaction and applies a buffer. Throws if wallet is not connected.
   * @param address The address of the RPG game contract.
   * @param signer The wallet signer used to send the transaction.
   * @return The transaction response from the contract's j1Timeout function.
   */
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
