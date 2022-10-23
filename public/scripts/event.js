/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllEvents(fields) {
  fetch('/api/events')
    .then(showResponse)
    .catch(showResponse);
}

function viewEventsByAuthor(fields) {
  fetch(`/api/events?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createEvent(fields) {
  fetch('/api/events', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function cancelEvent(fields) {
  fetch(`/api/events/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
