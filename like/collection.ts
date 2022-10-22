import {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore Likes
 * stored in MongoDB, including adding, finding, updating, and deleting Likes, and also finding the
 * Like Count (the number of unique users that like a particular freet).
 *
 * Note: HydratedDocument<Like> is the output of the LikeModel() constructor,
 * and contains all the information in Like. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a Like to the collection
   *
   * @param {string} userID - The id of the user making the Like
   * @param {string} freetID - The id of the freet being Likeed
   * @return {Promise<HydratedDocument<Like>>} - The newly created Like
   */
  static async addOne(user: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const Like = new LikeModel({
      user,
      freet
    });
    await Like.save(); // Saves freet to MongoDB
    return Like;
  }

  /**
   * Find a Like by LikeID
   *
   * @param {string} LikeId - The id of the Like to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The Like with the given LikeId, if any
   */
  static async findOne(LikeId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: LikeId});
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
   * @param {string} username - The username of user of the Likes
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the Likes
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const author = await UserCollection.findOneByUsername(username);
    return LikeModel.find({authorId: author._id});
  }

  /**
   * Delete a Like with given LikeId.
   *
   * @param {string} LikeId - The LikeId of Like to delete
   * @return {Promise<Boolean>} - true if the Like has been deleted, false otherwise
   */
  static async deleteOne(LikeId: Types.ObjectId | string): Promise<boolean> {
    const Like = await LikeModel.deleteOne({_id: LikeId});
    return Like !== null;
  }

  /**
   * Delete all the Likes by the given user
   *
   * @param {string} userId - The id of user of Likes
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({userId});
  }

  /**
   * Get the like count for a particular freet
   *
   * @param {string} freetId - The freetId to assess for like count
   * @return {Promise<int>} - The number of users whom have liked this freet //TODO - WHAT DO THE CURLY BRACES MEAN?
   */
  static async countLikes(freetId: Types.ObjectId | string): Promise<number> {
    const freet = await FreetCollection.findOne(freetId);
    // const likes = await LikeModel.find({freetId: freet._id});
    // return likes.length;
    const likeCount = await LikeModel.countDocuments({freetId: freet._id});
    return likeCount;
  }
}
export default LikeCollection;
