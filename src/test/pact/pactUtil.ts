const request = require('superagent');

export async function getUserDetails(self, securityCookie) {
  return request.get(`${self}/details`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}
