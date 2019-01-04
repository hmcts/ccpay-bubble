Feature('CCPayBubble Smoke Test');

Scenario('CCPayBubble Web Health Check Test', I => {
  I.amOnPage('/');
  I.see('{"status":"UP"}');
});