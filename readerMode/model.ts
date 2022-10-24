import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in ReaderMode
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for ReaderMode on the backend
export type ReaderMode = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  inReaderMode: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReaderModeSchema = new Schema({
  // The user whose status in ReaderMode is being recorded
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The user's status with respect to ReaderMode, true if in ReaderMode and false otherwise
  inReaderMode: {
    type: Boolean,
    required: true
  }
});

// TODO - MAKE SURE THAT CANNOT HAVE DUPLICATE USERS
// ADD THIS TO CHECK FOR DUPLICATES
ReaderModeSchema.index({user: 1}, {unique: true});

const ReaderModeModel = model<ReaderMode>('ReaderMode', ReaderModeSchema);
export default ReaderModeModel;
