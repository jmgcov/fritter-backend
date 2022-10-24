import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReaderModeCollection from '../readerMode/collection';

/**
 * Checks if the user is in Reader Mode, such that all public-facing actions are blocked.
 **/
const isInReaderMode = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const readerMode = await ReaderModeCollection.findOneByUserId(req.session.userId);

    if (readerMode.inReaderMode) {
      res.status(403).json({
        error: {
          error: 'This action is not possible in Reader Mode. Exit Reader Mode to continue.'
        }
      });
      return;
    }
  }

  next();
};

export {
  isInReaderMode
};
