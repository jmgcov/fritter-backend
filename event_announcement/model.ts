import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an Event Announcement
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Event Announcement on the backend
export type Event = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateModified: Date;
  eventDate: Date;
  eventSubject: string;
  eventLocation: string;
  cancelled: boolean;
  // Event Announcements are created using a synergy with Freet: the author and content (description) 
  // for an event announcement are stored in an underlying Freet
  associatedFreet: Types.ObjectId;
  // TODO - THINK ABOUT WHETHER EVENT FREETS SHOW UP IN VIEW ALL, VIEW BY AUTHOR
  // TODO - SHOULD NOT BE ABLE TO EDIT OR DELETE OR BOOKMARK OR LIKE UNDERLYING FREET FOR AN EVENT
  // INDEPENDENTLY?
  // TODO - MAYBE ADD "IS EVENT ANNOUNCEMENT" BOOLEAN TO FREET?
  authorId: Types.ObjectId;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EventSchema = new Schema<Event>({
  // TODO - CHECK IN MIDDLEWARE THAT DATE LATER THAN NOW
  // The event date (including time)
  dateModified: {
    type: Date,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventSubject: {
    type: String,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  cancelled: {
    type: Boolean,
    required: true
  },
  associatedFreet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});

// // (virtual-population)
// // Auto-populate a Event.authorId field with the author associated with this Event (from the
// // associatedFreet)
// EventSchema.virtual('authorId', {
//   ref: 'Freet',
//   localField: 'authorId',
//   foreignField: 'authorId'
// });

const EventModel = model<Event>('Event', EventSchema);
export default EventModel;
