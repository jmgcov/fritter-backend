/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllBookmarks(fields) {
  fetch('/api/bookmark')
    .then(showResponse)
    .catch(showResponse);
}

function viewBookmarksByUser(fields) {
  fetch(`/api/bookmark?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function createBookmark(fields) {
  fetch('/api/bookmark', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteBookmark(fields) {
  fetch(`/api/bookmark/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
