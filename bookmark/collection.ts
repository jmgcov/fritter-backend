import type {HydratedDocument, Types} from 'mongoose';
import type {Bookmark} from './model';
import BookmarkModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 *
 * Note: HydratedDocument<Bookmark> is the output of the BookmarkModel() constructor,
 * and contains all the information in Bookmark. https://mongoosejs.com/docs/typescript.html
 */
class BookmarkCollection {
  /**
   * Add a bookmark to the collection
   *
   * @param {string} userID - The id of the user making the bookmark
   * @param {string} freetID - The id of the freet being bookmarked
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created Bookmark
   */
  static async addOne(user: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const bookmark = new BookmarkModel({
      user,
      freet
    });
    await bookmark.save(); // Saves freet to MongoDB
    return bookmark;
    // IS THIS OK?  DO I NEED TO AWAIT SOMETHING FIRST?
  }

  /**
   * Find a bookmark by bookmarkID
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
  static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({_id: bookmarkId});
  }

  /**
   * Get all the bookmarks in the database
   *
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAll(): Promise<Array<HydratedDocument<Bookmark>>> {
    // Retrieves bookmarks
    return BookmarkModel.find({});
  }

  /**
   * Get all the bookmarks by given user
   *
   * @param {string} username - The username of user of the bookmarks
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BookmarkModel.find({authorId: author._id});
  }

  /**
   * Delete a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The bookmarkId of bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const bookmark = await BookmarkModel.deleteOne({_id: bookmarkId});
    return bookmark !== null;
  }

  /**
   * Delete all the bookmarks by the given user
   *
   * @param {string} userId - The id of user of bookmarks
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({userId});
  }
}

export default BookmarkCollection;
