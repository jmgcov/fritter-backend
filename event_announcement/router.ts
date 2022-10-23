import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import EventCollection from './collection';
import * as userValidator from '../user/middleware';
import * as eventValidator from '../event_announcement/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the events
 *
 * @name GET /api/events
 *
 * @return {EventResponse[]} - A list of all the events sorted in descending
 *                      order by date modified
 */
/**
 * Get events by author.
 *
 * @name GET /api/events?authorId=id
 *
 * @return {FreetResponse[]} - An array of events created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allEvents = await EventCollection.findAll();
    const response = allEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorEvents = await EventCollection.findAllByUsername(req.query.author as string);
    const response = authorEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new event.
 *
 * @name POST /api/events
 *
 * @param {Date} eventDate - The date and time of the event
 * @param {string} eventSubject - The subject of the event
 * @param {string} eventLocation - The location for the event
 * @param {string} eventDescription - The description of the event
 * @return {EventResponse} - The created event
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the event content, or event subject, event location or event date is empty or a stream of empty spaces
 * @throws {413} - If the event content is more than 140 characters long, or the event subject is
 * more than 70 characters long, or the event date is in the past, or the event location is more than 
 * 70 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isValidEventDescription,
    eventValidator.isValidEventDate, // TODO - implement
    eventValidator.isValidEventSubject, // TODO - implement
    eventValidator.isValidEventLocation
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    console.log('user id', userId);
    const event = await EventCollection.addOne(userId, req.body.eventDate, req.body.eventSubject, req.body.eventLocation, req.body.eventDescription);

    res.status(201).json({
      message: 'Your event was created successfully.',
      event: util.constructEventResponse(event)
    });
  }
);

/**
 * Cancel an event
 *
 * @name PUT /api/events/:id
 *
 * @return {EventResponse} - the updated event, now cancelled
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the event
 * @throws {404} - If the eventId is not valid
 */
router.put(
  '/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists,
    eventValidator.isValidEventModifier
  ],
  async (req: Request, res: Response) => {
    const event = await EventCollection.cancelOne(req.params.eventId);
    res.status(200).json({
      message: 'Your event was cancelled successfully.',
      event: util.constructEventResponse(event)
    });
  }
);

export {router as eventRouter};
