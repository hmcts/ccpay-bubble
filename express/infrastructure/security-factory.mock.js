const Security = require('./security').Security;
const config = require('config');

const mockSecurity = new Security({
  clientId: config.idam.client_id,
  clientSecret: config.idam.client_secret,
  loginUrl: config.idam.login_url,
  registrationUrl: config.idam.registration_url,
  apiUrl: config.idam.api_url,
  redirectUri: '/oauth2/callback'
});

mockSecurity.protect = function protect(role) {
  role.toString();
  return function ret(req, res, next) {
    return next();
  };
};

mockSecurity.protectWithAnyOf = function protectWithAnyOf(roles) {
  roles.toString();
  return function ret(req, res, next) {
    return next();
  };
};

module.exports = mockSecurity;
