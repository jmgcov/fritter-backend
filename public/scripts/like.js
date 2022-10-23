/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllLikes(fields) {
  fetch('/api/like')
    .then(showResponse)
    .catch(showResponse);
}

function viewLikesByUser(fields) {
  fetch(`/api/like?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function createLike(fields) {
  console.log('fields', fields);
  fetch('/api/like', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteLike(fields) {
  fetch(`/api/like/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewLikesByFreetId(fields) {
  fetch(`/api/like/count?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

// function viewLikesByFreetId(fields) {
//   fetch(`/api/like?freetId=${fields.freetId}`)
//     .then(showResponse)
//     .catch(showResponse);
// }
