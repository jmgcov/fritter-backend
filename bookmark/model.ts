import type {Types, PopulatedDoc, Document, TypeExpressionOperator} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Bookmark
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for bookmarkedItem on the backend
export type Bookmark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId; // The user making the bookmarks
  freet: Types.ObjectId; // The freet being bookmarked
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BookmarkSchema = new Schema<Bookmark>({
  // The user doing the bookmarking
  user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true
  },
  // The freet being bookmarked
  freet: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// ADD THIS TO CHECK FOR DUPLICATES
BookmarkSchema.index({user: 1, freet: 1}, {unique: true});

const BookmarkModel = model<Bookmark>('Bookmark', BookmarkSchema);
export default BookmarkModel;
