import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as LikeValidator from '../Like/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the Likes
 *
 * @name GET /api/Like
 *
 * @return {LikeResponse[]} - A list of all the Likes
 */
/**
 * Get Likes by user.
 *
 * @name GET /api/Like?username=username
 *
 * @return {LikeResponse[]} - An array of Likes created by user with id, userId
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

    const allLikes = await LikeCollection.findAll();
    const response = allLikes.map(util.constructLikeResponse); // IMPLEMENT
    res.status(200).json(response);
  },
  // [
  //   userValidator.isAuthorExists // NEED A DIFFERENT KIND OF VALIDATION HERE?
  // ],
  async (req: Request, res: Response) => {
    const userLikes = await LikeCollection.findAllByUsername(req.query.username as string);
    const response = userLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Like.
 *
 * @name POST /api/Like/
 *
 * @param {string} freetId - The freet to Like
 * @return {LikeResponse} - The created Like
 * @throws {403} - If the user is not logged in
 * @throws {409} - If Like is a duplicate or otherwise cannot be created
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    try {
      const Like = await LikeCollection.addOne(userId, req.body.freetId);

      res.status(201).json({
        message: 'Your Like was created successfully.',
        Like: util.constructLikeResponse(Like) // IMPLEMENT
      });
    } catch {
      res.status(409).json({
        message: 'Your Like was a duplicate or otherwise could not be created.' // TODO - ASK RE MOVING TO MIDDLEWARE
      });
    }
  }
);

/**
 * Delete a Like
 *
 * @name DELETE /api/Like/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:likeId?',
  [
    userValidator.isUserLoggedIn,
    LikeValidator.isLikeExists,
    LikeValidator.isValidLikeModifier // NEED TO IMPLEMENT, AND ADD TO IMPORTS
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.likeId);
    res.status(200).json({
      message: 'Your Like was deleted successfully.'
    });
  }
);

// TODO - ADD TO API ROUTES
/**
 * Get the like count by likeId.
 *
 * @name GET /api/Like/Count/:likeId?
 *
 * @return {number} - The number of likes for the like with likeId
 * @throws {400} - If likeId is not given
 * @throws {404} - If no like has given likeId
 *
 */
router.get(
  '/Count/:likeId?',
  [
    LikeValidator.isLikeExists
  ],
  async (req: Request, res: Response) => {
    const count = await LikeCollection.countLikes(req.params.likeId);
    res.status(200).json({
      likeCount: count
    });
  }
);

export {router as likeRouter};
