'use strict';

const chai = require('chai');
const expect = chai.expect;
const { PactTestSetup } = require('../settings/provider.mock');
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const { validateCaseReference } = require('../../pactUtil');
const pactSetUp = new PactTestSetup({provider: 'ccdDataStoreApi', port: 8000});

describe('CaseData', () => {
  const mockResponse = {
    'status_message' : somethingLike('OK'),
    'caseref' : somethingLike('12345678')
  };
  describe('/get cases', () => {
    const jwt = 'some-access-token';
    const caseId = '12345678';
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'A Search for cases is requested',
        uponReceiving: 'a request for that case',
        withRequest: {
          method: 'GET',
          path: `/cases/12345678`,
          headers: {
            ContentType: 'application/json',
            Authorization: 'Bearer some-access-token',
            ServiceAuthorization: 'Bearer ServiceAuthToken'
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: mockResponse
        }
      };
      pactSetUp.provider.addInteraction(interaction).then(() => {});
    });
    it('Returns Case', async () => {
      const taskUrl = `${pactSetUp.provider.mockService.baseUrl}`;
      const response = validateCaseReference(taskUrl, jwt, caseId);
      response.then((Response) => {
        const dto: CcdGetResponseDto = <CcdGetResponseDto>Response.body;
        assertResponse(dto);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });
  });
});

function assertResponse(dto: CcdGetResponseDto) {
  expect(dto.status_message).to.be.equal('OK');
  expect(dto.caseref).to.be.equal('12345678');
}

export interface CcdGetResponseDto {
  status_message: string;
  caseref: string;
}
