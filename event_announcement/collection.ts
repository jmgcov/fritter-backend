import type {HydratedDocument, Types} from 'mongoose';
import type {Event} from './model';
import EventModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

// TODO - ADD AUTOMATIC TWEET WHEN AN EVENT HAS BEEN CANCELLED

/**
 * This files contains a class that has the functionality to explore event announcements
 * stored in MongoDB, including adding, finding, and CANCELLING event announcements.
 *
 * NOTE: EVENT ANNOUNCEMENTS CANNOT BE MODIFIED OR DELETED ONCE CREATED, BUT ONLY "CANCELLED," FOR
 * REASONS EXPLAINED IN MY PRIOR ASSIGNMENTS.
 *
 * Note: HydratedDocument<Event> is the output of the EventModel() constructor,
 * and contains all the information in Event. https://mongoosejs.com/docs/typescript.html
 */
class EventCollection {
  /**
   * Add an event to the collection
   *
   * @param {string} authorId - The id of the author of the event
   * @param {Date} eventDate - The date (including) time of the event
   * @param {string} eventSubject - The subject of the event
   * @param {string} eventLocation - The location of the event
   * @param {string} eventDescription - The description of the event
   * @return {Promise<HydratedDocument<Event>>} - The newly created event
   */
  static async addOne(authorId: Types.ObjectId | string, eventDate: Date, eventSubject: string,
    eventLocation: string, eventDescription: string): Promise<HydratedDocument<Event>> {
    const creationDate = new Date();
    // TODO - IN MIDDLEWARE, REMEMBER TO CALL THE FREET MIDDLEWARE TO VALIDATE THE FREET CONTENT
    const freet = await FreetCollection.addOne(authorId, eventDescription);
    const event = new EventModel({
      dateModified: creationDate,
      eventDate,
      eventSubject,
      eventLocation,
      cancelled: false,
      associatedFreet: freet._id,
      authorId
    });
    await event.save(); // Saves event to MongoDB
    return event;
  }

  /**
   * Find an event by eventId
   *
   * @param {string} eventId - The id of the event to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The event with the given eventId, if any
   */
  static async findOne(eventId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    return EventModel.findOne({_id: eventId});
  }

  /**
   * Find an event by eventId by the freetId of the freet associated with the event, or null if the
   * freetId is not associated with any event.
   * 
   *
   * @param {string} eventId - The id of the event to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The event with the given eventId, if any
   */
  static async findOneByFreetId(freetId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    return EventModel.findOne({associatedFreet: freetId});
  }

  /**
   * Get all the events in the database
   *
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
  static async findAll(): Promise<Array<HydratedDocument<Event>>> {
    // Retrieves events and sorts them from most to least recent
    return EventModel.find({}).sort({dateModified: -1});
  }

  // TODO - MAKE SURE TO TEST THIS -- USES VIRTUAL POPULATION
  /**
   * Get all the events by given author
   *
   * @param {string} username - The username of author of the events
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the events
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Event>>> {
    const author = await UserCollection.findOneByUsername(username);
    return EventModel.find({authorId: author._id});
  }

  /**
   * Cancel an event with given eventId. DOES NOT DELETE THE EVENT FROM THE DATABASE.
   *
   * @param {string} eventId - The eventId of the event to delete
   * @return {Promise<Boolean>} - true if the event has been cancelled, false otherwise
   */
  static async cancelOne(eventId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    event.cancelled = true;
    event.dateModified = new Date();
    await event.save();
    return event;
  }

  // TODO - MAKE SURE TO TEST THIS -- USES VIRTUAL POPULATION
  /**
   * Cancel all the events by the given author
   *
   * @param {string} authorId - The id of author of events
   */
  static async cancelMany(authorId: Types.ObjectId | string): Promise<void> {
    /* eslint-disable no-await-in-loop */
    const events = await EventModel.find({authorId: authorId as string});
    for (const individualEvent of events) {
      await this.cancelOne(individualEvent._id);
    }
  }
}

export default EventCollection;
