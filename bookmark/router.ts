import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookmarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from '../bookmark/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the bookmarks
 *
 * @name GET /api/bookmark
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks
 */
/**
 * Get bookmarks by user.
 *
 * @name GET /api/bookmark?username=username
 *
 * @return {BookmarkResponse[]} - An array of bookmarks created by user with id, userId
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if username query parameter was supplied
    if (req.query.username !== undefined) {
      next();
      return;
    }

    const allBookmarks = await BookmarkCollection.findAll();
    const response = allBookmarks.map(util.constructBookmarkResponse); // IMPLEMENT
    res.status(200).json(response);
  },
  // [
  //   userValidator.isAuthorExists // NEED A DIFFERENT KIND OF VALIDATION HERE?
  // ],
  async (req: Request, res: Response) => {
    const userBookmarks = await BookmarkCollection.findAllByUsername(req.query.username as string);
    const response = userBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new bookmark.
 *
 * @name POST /api/bookmark/
 *
 * @param {string} freetId - The freet to bookmark
 * @return {BookmarkResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freetId is empty or a stream of empty spaces
 * // OR IF THE BOOKMARK IS A DUPLICATE?  HOW TO DEAL WITH DUPLICATES?
//  * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  //   // freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmark = await BookmarkCollection.addOne(userId, req.body.freetId);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookmarkResponse(bookmark) // IMPLEMENT
    });
  }
);

// Prior version
// router.post(
//   '/',
//   [
//     userValidator.isUserLoggedIn
//   //   // freetValidator.isValidFreetContent
//   ],
//   async (req: Request, res: Response) => {
//     console.log('I am here.');
//     const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
//     console.log('userId', userId);
//     const bookmark = await BookmarkCollection.addOne(userId, req.body.freetId);
//     console.log('bookmark', bookmark);

//     res.status(201).json({
//       message: 'Your bookmark was created successfully.',
//       bookmark: util.constructBookmarkResponse(bookmark) // IMPLEMENT
//     });
//   }
// );

/**
 * Delete a bookmark
 *
 * @name DELETE /api/bookmark/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:bookmarkId?',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists // NEED TO IMPLEMENT, AND ADD TO IMPORTS
    // freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await BookmarkCollection.deleteOne(req.params.bookmarkId);
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);

// /**
//  * Modify a freet
//  *
//  * @name PUT /api/freets/:id
//  *
//  * @param {string} content - the new content for the freet
//  * @return {FreetResponse} - the updated freet
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the freet
//  * @throws {404} - If the freetId is not valid
//  * @throws {400} - If the freet content is empty or a stream of empty spaces
//  * @throws {413} - If the freet content is more than 140 characters long
//  */
// router.put(
//   '/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier,
//     freetValidator.isValidFreetContent
//   ],
//   async (req: Request, res: Response) => {
//     const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
//     res.status(200).json({
//       message: 'Your freet was updated successfully.',
//       freet: util.constructFreetResponse(freet)
//     });
//   }
// );

export {router as bookmarkRouter};
