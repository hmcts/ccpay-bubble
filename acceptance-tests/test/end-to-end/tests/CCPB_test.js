const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(I => {
  I.amOnPage('/');
  I.resizeWindow(CCPBATConstants.windowsSizeX, CCPBATConstants.windowsSizeY);
});

Scenario('Should redirect to login page', I => {
  I.fillField('Email address', 'caseworker@hmcts.net');
  I.fillField('Password', 'Passw0rd');
  I.click('Sign in');
});
