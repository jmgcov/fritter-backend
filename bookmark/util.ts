import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Bookmark} from '../bookmark/model';

// Update this if you add a property to the Freet type!
type BookmarkResponse = {
  _id: string;
  user: string; // The user making the bookmarks
  freet: string; // The freet being bookmarked
};

// /**
//  * Encode a date as an unambiguous string
//  *
//  * @param {Date} date - A date object
//  * @returns {string} - formatted date as string
//  */
// const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Bookmark object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Bookmark>} bookmark - A bookmark
 * @returns {BookmarkResponse} - The bookmark object formatted for the frontend
 */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: Bookmark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    _id: bookmarkCopy._id.toString(),
    user: bookmarkCopy.user.toString(),
    freet: bookmarkCopy.freet.toString()
  };
};

export {
  constructBookmarkResponse
};
