import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from 'freet/collection';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including adding, finding, updating, and deleting likes.
 *
 * Note: HydratedDocument<Like> is the output of the LikeModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} userID - The id of the user making the like
   * @param {string} freetID - The id of the freet being liked
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created Like
   */
  static async addOne(user: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      user,
      freet
    });
    await like.save(); // Saves like to MongoDB
    return like;
  }

  /**
   * Find a Like by likeID
   *
   * @param {string} likeId - The id of the Like to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The like with the given likeId, if any
   */
  static async findOne(likeId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: likeId});
  }

  /**
   * Get all the Likes in the database
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the Likes
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves Likes
    return LikeModel.find({});
  }

  /**
   * Get all the Likes by given user
   *
   * @param {string} username - The username of user of the likes
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return LikeModel.find({user: owner._id});
  }

  /**
   * Delete a Like with given likeId.
   *
   * @param {string} likeId - The likeId of like to delete
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(likeId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({_id: likeId});
    return like !== null;
  }

  /**
   * Delete all the likes by the given user
   *
   * @param {string} userId - The id of user of likes
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({userId});
  }

  /**
   * Count all the Likes for a particular freet
   *
   * @param {string} freetId - The freetId of the freet
   * @return {Promise<number>} - The number of users that like that freet
   */
  static async countLikes(freetId: string): Promise<number> {
    const count = await LikeModel.countDocuments({freet: freetId});
    return count;
  }
}

export default LikeCollection;
