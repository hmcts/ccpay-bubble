'use strict';

const {createAuthToken} = require('../../pactUtil');
const { PactTestSetup } = require('../settings/provider.mock');
const pactSetUp = new PactTestSetup({provider: 's2s_auth', port: 8000});
const config = require('config');
const otp = require('otp');
const ccpayBubbleSecret = config.get('secrets.ccpay.paybubble-s2s-secret');
const microService = config.get('ccpaybubble.microservice');
const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();

const payload = {
  'microservice': microService,
  'oneTimePassword': otpPassword
};

const s2sResponseSecret = {
  's2sResponseSecret' : 'someMicroServiceToken',
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
            'Content-Type': 'text/plain;charset=ISO-8859-1'
          },
          body: 'someMicroServiceToken',
        },
      };
      pactSetUp.provider.addInteraction(interaction).then(() => {
      });
    });
    it('returns the token from S2S service', async () => {
      const taskUrl = `${pactSetUp.provider.mockService.baseUrl}`;
      const response = createAuthToken(taskUrl, payload);

      response.then((Response) => {
      }).then(() => {
        pactSetUp.provider.verify();
        pactSetUp.provider.finalize();
      });
    });
  });
});
