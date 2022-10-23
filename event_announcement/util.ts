import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Event} from '../event_announcement/model';

// Update this if you add a property to the Event type!
type EventResponse = {
  _id: string;
  dateModified: string;
  eventDate: string;
  eventSubject: string;
  eventLocation: string;
  cancelled: string;
  associatedFreet: string;
  // authorId: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Event object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Event>} event - An event
 * @returns {EventResponse} - The event object formatted for the frontend
 */
const constructEventResponse = (event: HydratedDocument<Event>): EventResponse => {
  const eventCopy: Event = {
    ...event.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...eventCopy,
    _id: eventCopy._id.toString(),
    dateModified: formatDate(eventCopy.dateModified),
    eventDate: formatDate(eventCopy.eventDate),
    cancelled: eventCopy.cancelled.toString(),
    associatedFreet: eventCopy.associatedFreet.toString()
    // authorId: eventCopy.authorId.toString()
  };
};

export {
  constructEventResponse
};
