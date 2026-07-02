'use strict';

const assert = require('assert');
const utils = require('./utils');

describe('utils IDAM token config', () => {
  it('fails before requesting an IDAM token when credentials are missing', () => {
    assert.throws(
      () => utils._private.validateIDAMTokenConfig(undefined, 'password', 'client', 'secret', 'redirect', 'probate user'),
      /IDAM token request skipped \(probate user\): missing username/
    );
  });

  it('does not report missing config when required IDAM values are present', () => {
    assert.doesNotThrow(() => utils._private.validateIDAMTokenConfig(
      'user@example.com',
      'password',
      'client',
      'secret',
      'redirect',
      'probate user'
    ));
  });
});
