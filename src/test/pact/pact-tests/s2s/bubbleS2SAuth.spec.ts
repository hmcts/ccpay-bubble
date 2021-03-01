import {string} from '@pact-foundation/pact/src/dsl/matchers';


const {createAuthToken} = require('../../pactUtil');
const chai = require('chai');
const expect = chai.expect;
const { PactTestSetup } = require('../settings/provider.mock');
const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const s2sResponseSecret = 'someMicroServiceToken';
const pactSetUp = new PactTestSetup({provider: 's2s_auth', port: 8000});


const config = require('config');
const otp = require('otp');
const ccpayBubbleSecret = config.get('secrets.ccpay.paybubble-s2s-secret');
const microService = config.get('ccpaybubble.microservice');

const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
const payload = {
  microservice: microService,
  oneTimePassword: otpPassword
};

describe('ccpay-bubble AUTH token', async () => {
  before(async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  describe('POST /lease', () => {
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'microservice with valid credentials',
        uponReceiving: 'a request for a token for a microservice',
        withRequest: {
          method: 'POST',
          path: '/lease',
          body: payload,
          headers: {
            'Content-Type' : 'application/json'
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type' : 'application/json'
          },
          body: string(s2sResponseSecret),
        },
      };
      pactSetUp.provider.addInteraction(interaction).then(() => {
      });
    });
    it('returns the token from S2S service', async () => {
      const taskUrl = `${pactSetUp.provider.mockService.baseUrl}/lease`;
      const response = createAuthToken(taskUrl, payload);

      response.then((Response) => {
        console.log('Response2' + response);
        const authResponse: string = Response.data;
        console.log('Test' + authResponse);
        expect(authResponse).to.be.equal(s2sResponseSecret);
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });
  });
});
