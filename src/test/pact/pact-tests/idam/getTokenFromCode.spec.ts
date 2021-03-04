'use strict';

const chai = require('chai');
const expect = chai.expect;
const { getTokenFromCode } = require('../../pactUtil');
const { PactTestSetup } = require('../settings/provider.mock');
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'idamApi_users', port: 8000 });


describe('Idam API user details', () => {

  const RESPONSE_BODY = {
    'access_token': somethingLike('eyJ0eXAiOiJKV1QiLCJraWQiOiJiL082T3ZWdjEre'),
    'refresh_token': somethingLike('eyJ0eXAiOiJKV1QiLCJ6aXAiOiJOT05FIiwia2lkIjoiYi9PNk92V'),
    'scope': somethingLike('openid roles profile'),
    'id_token': somethingLike('eyJ0eXAiOiJKV1QiLCJraWQiOiJiL082T3ZWdjEre'),
    'token_type': somethingLike('Bearer'),
    'expires_in': somethingLike('4567788')
  };
  const code = 'some code';

  const mockRequest = {
    'grant_type': 'authorization_code' ,
    'code': code,
    'redirect_uri': 'http://www.somedummyredirecturi.com'
  };

  describe('get token from code', () => {


    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'I have an obtained authorization_code as a user and a client',
        uponReceiving: 'a request for a getting token',
        withRequest: {
          method: 'POST',
          path: '/oauth2/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer some-access-token',
          },
          body: mockRequest
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: RESPONSE_BODY,
        },
      };
      // @ts-ignore
      pactSetUp.provider.addInteraction(interaction);
    });
    it('returns the correct response', async () => {
      const taskUrl = `${pactSetUp.provider.mockService.baseUrl}`;

      const response: Promise<any> = getTokenFromCode(taskUrl, code);

      response.then((Response) => {
        const dto: IdamGetTokenWithCodeResponseDto = <IdamGetTokenWithCodeResponseDto>Response.body;
        assertResponses(dto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });
  });
});

function assertResponses(dto: IdamGetTokenWithCodeResponseDto) {
  expect(dto.access_token).to.be.equal('eyJ0eXAiOiJKV1QiLCJraWQiOiJiL082T3ZWdjEre');
  expect(dto.refresh_token).to.be.equal('eyJ0eXAiOiJKV1QiLCJ6aXAiOiJOT05FIiwia2lkIjoiYi9PNk92V');
  expect(dto.scope).to.be.equal('openid roles profile');
  expect(dto.id_token).to.be.equal('eyJ0eXAiOiJKV1QiLCJraWQiOiJiL082T3ZWdjEre');
  expect(dto.token_type).to.be.equal('Bearer');
  expect(dto.expires_in).to.be.equal('4567788');
}

export interface IdamGetTokenWithCodeResponseDto {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: string[];
}
