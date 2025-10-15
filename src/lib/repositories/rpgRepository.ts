import { RPG } from "@/lib/models/rpg.model";
import { IRPG } from "@/types";
import { ErrorHandler } from "../utils/errorHandler";

export class RPGRepository {
  /**
   * @notice Saves a new RPG game to the database.
   * @dev Inserts a new game document using the provided IRPG data.
   * @param data The game data to save (see IRPG type).
   * @return The saved game object.
   */
  static async saveNewGame(data: IRPG) {
    const result = await RPG.insertOne(data);
    return result.toObject();
  }

  /**
   * @notice Retrieves all RPG games for a given player address.
   * @dev Finds games where the player is either player1 or player2.
   * @param playerAddress The wallet address of the player.
   * @return An array of RPG game objects associated with the player.
   */
  static async getRPGGames(playerAddress: string) {
    return ErrorHandler.withRetry(async () => {
      return RPG.find({
        $or: [
          { player1Address: playerAddress },
          { player2Address: playerAddress },
        ],
      })
        .lean<IRPG[]>()
        .exec();
    });
  }

  /**
   * @notice Updates an existing RPG game in the database.
   * @dev Finds the game by its ID and updates it with the provided data. Creates a new game if not found.
   * @param data The updated game data (see IRPG type).
   * @return The updated RPG game object.
   */
  static async updateRPGGame(data: IRPG) {
    ErrorHandler.withRetry(async () => {
      const _data = await RPG.findByIdAndUpdate(
        data._id?.toLowerCase(), // normalize id
        { $set: data }, // update data
        { upsert: true, new: true, lean: true } // return plain object
      );

      return _data as IRPG;
    });
  }
}
