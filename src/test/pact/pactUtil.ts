const request = require('superagent');

export async function getUserDetails(self, securityCookie) {
  return request.get(`${self}/details`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${securityCookie}`);
}


export async function getTokenFromCode(self, code) {
  return await request.post(`${self}/oauth2/token`)
  .set('Authorization', 'Bearer some-access-token')
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send({ grant_type: 'authorization_code' })
  .send({ code: code })
  .send({ redirect_uri: `http://www.somedummyredirecturi.com` });
}

export async function createAuthToken(taskUrl: string, payload: any) {
  return (await request.post(`${taskUrl}/lease`, payload)
    .set('Content-Type', 'application/json'));
}

export async function validateCaseReference(taskUrl, securityCookie, caseId) {
  return request.get(`${taskUrl}/cases/${caseId.replace(/-/g, '')}`)
    .set('Authorization', `Bearer ${securityCookie}`)
    .set('ServiceAuthorization', 'Bearer ServiceAuthToken')
    .set('ContentType', 'application/json');
}
