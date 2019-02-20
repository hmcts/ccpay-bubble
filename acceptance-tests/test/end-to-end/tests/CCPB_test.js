const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Should redirect to login page', I => {
  I.login('email', 'password');
  I.setCookie({ name: 'auth', value: true });
  I.click('Advanced');
  I.click('Proceed to locahost');
});
