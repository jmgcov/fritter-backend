import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from '../Like/collection';

// TODO - WHAT IS THE STATUS?  REMOVE THE CONSOLE.LOGS?  OR STILL BROKEN?
/**
 * Checks if a Like with LikeId in req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log('here.');
  console.log('rec body Likeid', req.params.likeId);
  const validFormat = Types.ObjectId.isValid(req.params.likeId);
  console.log('validFormat', validFormat);
  const like = validFormat ? await LikeCollection.findOne(req.params.likeId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        LikeNotFound: `Like with Like ID ${req.params.likeId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the owner of the Like whose LikeId is in req.params
 */
const isValidLikeModifier = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOne(req.params.likeId);
  const userId = like.user;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' Likes.'
    });
    return;
  }

  next();
};

export {
  isLikeExists,
  isValidLikeModifier
};

// TODO
// CHECK FOR DUPLICATES, HTTP 409 IF CONFLICT
// ALSO NEED TO CHECK THAT FREET EXISTS, AND MAKE SURE THE BEHAVIOR IS CORRECT WHEN USER DELETES A 
// FREET WHICH IS PREVIOUSLY LikeED
