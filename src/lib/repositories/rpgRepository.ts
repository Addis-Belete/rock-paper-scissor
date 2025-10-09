import { RPG } from "@/lib/models/rpg.model";
import { IRPG } from "@/types";

export class RPGRepository {
  /**
   * @notice save new game
   * @param data {See IRPG}
   */
  static async saveNewGame(data: IRPG) {
    const result = await RPG.insertOne(data);
    return result.toObject();
  }

  /**
   * @notice get all games by address and status
   */

  static async getRPGGames(playerAddress: string) {
  return RPG.find({
    $or: [
      { player1Address: playerAddress },
      { player2Address: playerAddress }
    ],
  })
    .lean<IRPG[]>()
    .exec();
}

  /**
   * @notice updates rpg game data
   * @param data {See IRPG}
   * @returns
   */
  static async updateRPGGame(data: IRPG) {
    const _data = await RPG.findByIdAndUpdate(
      data._id?.toLowerCase(), // normalize id
      { $set: data }, // update data
      { upsert: true, new: true, lean: true } // return plain object
    );

    return _data as IRPG;
  }
}
