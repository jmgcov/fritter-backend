import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookmarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
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
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    console.log("Made it here.")
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
 * @throws {409} - If bookmark is a duplicate or otherwise cannot be created
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExistsBodyVersion
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    try {
      const bookmark = await BookmarkCollection.addOne(userId, req.body.freetId);

      res.status(201).json({
        message: 'Your bookmark was created successfully.',
        bookmark: util.constructBookmarkResponse(bookmark) // IMPLEMENT
      });
    } catch {
      res.status(409).json({
        message: 'Your bookmark was a duplicate or otherwise could not be created.' // TODO - ASK RE MOVING TO MIDDLEWARE
      });
    }
  }
);

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
    bookmarkValidator.isBookmarkExists,
    bookmarkValidator.isValidBookmarkModifier
  ],
  async (req: Request, res: Response) => {
    await BookmarkCollection.deleteOne(req.params.bookmarkId);
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);

export {router as bookmarkRouter};
