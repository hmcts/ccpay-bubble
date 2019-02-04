/* eslint-disable no-eq-null, eqeqeq */
const rq = require('client-request/promise');
const constants = require('../infrastructure/security').constants;
const HttpStatusCodes = require('http-status-codes');
const { Logger } = require('@hmcts/nodejs-logging');

function asyncTo(promise) {
  return promise.then(data => [null, data]).catch(err => [err]);
}

function setConfig(options, request) {
  if (!options.hasOwnProperty('uri') || !options.hasOwnProperty('method')) {
    throw new Error('"uri" and "method" should contain data.');
  }

  if (options.uri.length < 1 || options.method.length < 1) {
    throw new Error('"uri" and "method" should not be blank');
  }

  if (typeof options !== 'object' || (request && typeof request !== 'object')) {
    throw new Error(
      'Please ensure "options" and "request" are of type "Object".'
    );
  }

  options.json = options.json == null ? true : options.json;
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['Content-Type'] = options.headers['Content-Type'] == null ? 'application/json' : options.headers['Content-Type'];
  if (request && request.cookies[constants.SECURITY_COOKIE]) {
    // const bearer = request.cookies[constants.SECURITY_COOKIE];
    options.headers.Authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJycnAwMTJhNnJoZTdlYTMzamtmbWFiZTJwMSIsInN1YiI6IjEyNDUxNyIsImlhdCI6MTU0OTI4ODUxMSwiZXhwIjoxNTQ5MzE3MzExLCJkYXRhIjoiY2l0aXplbixjbGFpbWFudCxjaXRpemVuLWxvYTEsY2xhaW1hbnQtbG9hMSIsInR5cGUiOiJBQ0NFU1MiLCJpZCI6IjEyNDUxNyIsImZvcmVuYW1lIjoiY21jcHJlcHJvZCIsInN1cm5hbWUiOiJjbWMiLCJkZWZhdWx0LXNlcnZpY2UiOiJjbWMiLCJsb2EiOjEsImRlZmF1bHQtdXJsIjoiaHR0cHM6Ly93d3cubW9uZXljbGFpbXMuZGVtby5wbGF0Zm9ybS5obWN0cy5uZXQvcmVjZWl2ZXIiLCJncm91cCI6ImNpdGl6ZW5zIn0.mXLkch3Kl1ln2ig3vWaXvLUZ6kAOL4kGqg1s49PbuCY';
    options.headers.ServiceAuthorization = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE1NDkzMDMwMjJ9.sAav2XGn1EIm-vsURvVlaY99hv_Bv5WZ36wWmwhvq1bkxedwxwzW9H-qZTBR1kJH8wZT-Ej6KQC8gf7iyueXVw';
  }

  if (options.hasOwnProperty('method') && options.method === 'DELETE') {
    options.json = false;
  }

  options.headers.Authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJycnAwMTJhNnJoZTdlYTMzamtmbWFiZTJwMSIsInN1YiI6IjEyNDUxNyIsImlhdCI6MTU0OTI4ODUxMSwiZXhwIjoxNTQ5MzE3MzExLCJkYXRhIjoiY2l0aXplbixjbGFpbWFudCxjaXRpemVuLWxvYTEsY2xhaW1hbnQtbG9hMSIsInR5cGUiOiJBQ0NFU1MiLCJpZCI6IjEyNDUxNyIsImZvcmVuYW1lIjoiY21jcHJlcHJvZCIsInN1cm5hbWUiOiJjbWMiLCJkZWZhdWx0LXNlcnZpY2UiOiJjbWMiLCJsb2EiOjEsImRlZmF1bHQtdXJsIjoiaHR0cHM6Ly93d3cubW9uZXljbGFpbXMuZGVtby5wbGF0Zm9ybS5obWN0cy5uZXQvcmVjZWl2ZXIiLCJncm91cCI6ImNpdGl6ZW5zIn0.mXLkch3Kl1ln2ig3vWaXvLUZ6kAOL4kGqg1s49PbuCY';
  options.headers.ServiceAuthorization = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE1NDkzMDMwMjJ9.sAav2XGn1EIm-vsURvVlaY99hv_Bv5WZ36wWmwhvq1bkxedwxwzW9H-qZTBR1kJH8wZT-Ej6KQC8gf7iyueXVw';
  options.headers['return-url'] = 'https://localhost.com';

  return options;
}

/**
 * Decorate http request options
 * @param {Object} options
 * @param {XMLHttpRequest} request
 */
function makeHttpRequest(options, request) {
  return rq(setConfig(options, request));
}

function response(res, data, status = HttpStatusCodes.OK) {
  let success = true;
  if (status >= HttpStatusCodes.BAD_REQUEST) {
    success = false;
  }

  return res.status(status).json({ success, data });
}

function errorHandler(res, error, fileName) {
  Logger.getLogger(`BAR-WEB: ${fileName}`).error(error.body || error.message);
  res.status(error.response ? error.response.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR : HttpStatusCodes.INTERNAL_SERVER_ERROR);
  res.send(error.body || error.message);
}

module.exports = { asyncTo, makeHttpRequest, response, setConfig, errorHandler };
