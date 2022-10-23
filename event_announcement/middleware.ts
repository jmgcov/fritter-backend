import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import EventCollection from '../event_announcement/collection';

/**
 * Checks if an event with eventId in req.params exists
 */
const isEventExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.eventId);
  const event = validFormat ? await EventCollection.findOne(req.params.eventId) : '';
  if (!event) {
    res.status(404).json({
      error: {
        eventNotFound: `Event with event ID ${req.params.eventId} does not exist.`
      }
    });
    return;
  }

  next();
};

// TODO - SHOULDN'T NEED THESE, BECAUSE CAN ATTACH LIKES AND BOOKMARKS DIRECTLY TO THE UNDERLYING
// FREET
// /**
//  * Checks if a freet with freetId in req.query exists
//  */
// const isFreetExistsQueryVersion = async (req: Request, res: Response, next: NextFunction) => {
//   const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
//   const freet = validFormat ? await FreetCollection.findOne(req.query.freetId as string) : '';
//   if (!freet) {
//     res.status(404).json({
//       error: {
//         freetNotFound: `Freet with freet ID ${req.query.freetId as string} does not exist.`
//       }
//     });
//     return;
//   }

//   next();
// };

// /**
//  * Checks if a freet with freetId in req.body exists
//  */
// const isFreetExistsBodyVersion = async (req: Request, res: Response, next: NextFunction) => {
//   const validFormat = Types.ObjectId.isValid(req.body.freetId as string);
//   const freet = validFormat ? await FreetCollection.findOne(req.body.freetId as string) : '';
//   if (!freet) {
//     res.status(404).json({
//       error: {
//         freetNotFound: `Freet with freet ID ${req.body.freetId as string} does not exist.`
//       }
//     });
//     return;
//   }

//   next();
// };

/**
 * Checks if the content of the event in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidEventDescription = (req: Request, res: Response, next: NextFunction) => {
  const {eventDescription} = req.body as {eventDescription: string};
  if (!eventDescription.trim()) {
    res.status(400).json({
      error: 'Event description must be at least one character long.'
    });
    return;
  }

  if (eventDescription.length > 140) {
    res.status(413).json({
      error: 'Event description must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the subject of the event in req.body is valid, i.e not a stream of empty
 * spaces and not more than 70 characters
 */
const isValidEventSubject = (req: Request, res: Response, next: NextFunction) => {
  const {eventSubject} = req.body as {eventSubject: string};
  if (!eventSubject.trim()) {
    res.status(400).json({
      error: 'Event subject must be at least one character long.'
    });
    return;
  }

  if (eventSubject.length > 70) {
    res.status(413).json({
      error: 'Event description must be no more than 70 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the date of the event in req.body is valid, i.e not empty and not in the past
 */
const isValidEventDate = (req: Request, res: Response, next: NextFunction) => {
  const {eventDate} = req.body as {eventDate: Date};
  if (!eventDate) {
    res.status(400).json({
      error: 'You must provide a date and time for an event.'
    });
    return;
  }

  const today = new Date();
  const dateGiven = new Date(eventDate);
  if (dateGiven < today) {
    res.status(413).json({
      error: 'The date for an event cannot be in the past.'
    });
    return;
  }

  next();
};

/**
 * Checks if the location of the event in req.body is valid, i.e not a stream of empty
 * spaces and not more than 70 characters
 */
 const isValidEventLocation = (req: Request, res: Response, next: NextFunction) => {
  const {eventLocation} = req.body as {eventLocation: string};
  if (!eventLocation.trim()) {
    res.status(400).json({
      error: 'Event location must be at least one character long.'
    });
    return;
  }

  if (eventLocation.length > 70) {
    res.status(413).json({
      error: 'Event location must be no more than 70 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the event whose eventId is in req.params
 */
const isValidEventModifier = async (req: Request, res: Response, next: NextFunction) => {
  const event = await EventCollection.findOne(req.params.eventId);
  const userId = event.authorId;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' events.'
    });
    return;
  }

  next();
};

export {
  isValidEventDescription,
  isValidEventDate,
  isValidEventSubject,
  isValidEventLocation,
  isEventExists,
  isValidEventModifier
};
