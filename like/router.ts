import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from '../like/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the likes
 *
 * @name GET /api/like
 *
 * @return {LikeResponse[]} - A list of all the likes
 */
/**
 * Get likes by user.
 *
 * @name GET /api/like?username=username
 *
 * @return {LikeResponse[]} - An array of likes created by user with id, userId
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
    const response = allLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userLikes = await LikeCollection.findAllByUsername(req.query.username as string);
    const response = userLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new like.
 *
 * @name POST /api/like/
 *
 * @param {string} freetId - The freet to like
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {409} - If like is a duplicate or otherwise cannot be created
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
      const like = await LikeCollection.addOne(userId, req.body.freetId);

      res.status(201).json({
        message: 'Your like was created successfully.',
        like: util.constructLikeResponse(like)
      });
    } catch {
      res.status(409).json({
        message: 'Your like was a duplicate or otherwise could not be created.' // TODO - ASK RE MOVING TO MIDDLEWARE
      });
    }
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/like/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the owner of
 *                 the Like
 * @throws {404} - If the likeId is not valid
 */
router.delete(
  '/:likeId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isLikeExists,
    likeValidator.isValidLikeModifier
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.likeId);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

/**
 * Get the number of Likes for a freet by freetId.
 *
 * @name GET /api/like/count?freetId=freetId
 *
 * @return {number} - The number of users that like the given freet
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/count',
  [
    freetValidator.isFreetExistsQueryVersion
  ],
  async (req: Request, res: Response) => {
    const count = await LikeCollection.countLikes(req.query.freetId as string);
    const response = {likeCount: count};
    res.status(200).json(response);
  }
);

export {router as likeRouter};
