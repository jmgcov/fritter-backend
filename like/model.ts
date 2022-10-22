import type {Types, PopulatedDoc, Document, TypeExpressionOperator} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for bookmarkedItem on the backend
export type Like = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId; // The user making the like
  freet: Types.ObjectId; // The freet being liked
  extra_field: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  // The user doing the Liking
  user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true
  },
  // The freet being Likeed
  freet: {
    type: Schema.Types.ObjectId,
    required: true
  },
  extra_field: {type: Boolean, required: false}
});

// ADD THIS TO CHECK FOR DUPLICATES
LikeSchema.index({user: 1, freet: 1}, {unique: true});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
