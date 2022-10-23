import type {Types, PopulatedDoc, Document, TypeExpressionOperator} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Bookmark
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId; // The user making the Like
  freet: Types.ObjectId; // The freet being Liked
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  // The user doing the liking
  user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true
  },
  // The freet being liked
  freet: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

// ADD THIS TO CHECK FOR DUPLICATES
LikeSchema.index({user: 1, freet: 1}, {unique: true});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
