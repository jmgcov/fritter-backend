import type {HydratedDocument, Types} from 'mongoose';
import type {ReaderMode} from './model';
import ReaderModeModel from './model';
import UserCollection from '../user/collection';

/*
 * This files contains a class that has the functionality to explore reader mode
 * in MongoDB.
 *
 * Note: HydratedDocument<Bookmark> is the output of the BookmarkModel() constructor,
 * and contains all the information in Bookmark. https://mongoosejs.com/docs/typescript.html
 */
class ReaderModeCollection {
  /**
   * Add a user to ReaderMode, and set ReaderMode by default to off.
   *
   * @param {string} userID - The id of the user
   * @return {Promise<HydratedDocument<ReaderMode>>} - The newly created ReaderMode
   */
  static async addOne(user: Types.ObjectId | string): Promise<HydratedDocument<ReaderMode>> {
    const readerMode = new ReaderModeModel({
      user,
      inReaderMode: false
    });
    await readerMode.save(); // Saves readerMode to MongoDB
    return readerMode;
  }

  /**
   * Find a readerMode by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<ReaderMode>> | Promise<null>} - The readerMode for the given userId, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<ReaderMode>> {
    return ReaderModeModel.findOne({user: userId});
  }

  /**
 * Enter ReaderMode, for a given user (set inReaderMode to true).
 *
 * @param {string} userId - The userId of user to be updated
 * @return {Promise<HydratedDocument<ReaderMode>} - the ReaderMode associated with the user, with
 * inReaderMode set to true
 */
  static async enterReaderMode(userId: Types.ObjectId | string): Promise<HydratedDocument<ReaderMode>> {
    const readerMode = await ReaderModeModel.findOne({user: userId});
    readerMode.inReaderMode = true;
    await readerMode.save();
    return readerMode;
  }

  /**
 * Exit ReaderMode, for a given user (set inReaderMode to false).
 *
 * @param {string} userId - The userId of user to be updated
 * @return {Promise<HydratedDocument<ReaderMode>} - the ReaderMode associated with the user, with
 * inReaderMode set to false
 */
  static async exitReaderMode(userId: Types.ObjectId | string): Promise<HydratedDocument<ReaderMode>> {
    const readerMode = await ReaderModeModel.findOne({user: userId});
    readerMode.inReaderMode = false;
    await readerMode.save();
    return readerMode;
  }

  /**
   * Delete all ReaderModes by the given user (there should only be 1), for use only when deleting a
   * user from the database.
   *
   * @param {string} user - The id of user
   */
  static async deleteMany(user: Types.ObjectId | string): Promise<void> {
    await ReaderModeModel.deleteMany({user});
  }
}

export default ReaderModeCollection;
