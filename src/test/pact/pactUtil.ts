const request = require('superagent');

export async function getUserDetails(self, securityCookie) {
  return request.get(`${self}/details`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}

export async function createAuthToken(taskUrl: string, payload: any) {
  const response = await request.post(`${taskUrl}`, payload);
  return response;
}
