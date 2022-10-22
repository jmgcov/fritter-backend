import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like} from '../like/model';

// Update this if you add a property to the Like type!
type LikeResponse = {
  _id: string;
  user: string; // The user making the likes
  freet: string; // The freet being liked
};

// /**
//  * Encode a date as an unambiguous string
//  *
//  * @param {Date} date - A date object
//  * @returns {string} - formatted date as string
//  */
// const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: Like = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    _id: likeCopy._id.toString(),
    user: likeCopy.user.toString(),
    freet: likeCopy.freet.toString()
  };
};

export {
  constructLikeResponse
};
