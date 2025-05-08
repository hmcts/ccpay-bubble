/* Smoke test for the CCPayBubble application
   This test checks the health endpoint of the application to ensure it is up and running.
   It uses CodeceptJS.
*/
Feature('CCPayBubble Smoke Test');

Scenario('CCPayBubble Web Health Check Test', async ({ I }) => {
  I.amOnPage('/health'); // Navigate to the health endpoint
  const response = await I.grabSource(); // Grab the page source (JSON response)
  const jsonResponse = JSON.parse(response); // Parse the JSON response

  // Validate the JSON structure and values
  if (
    jsonResponse.status === 'UP' &&
    jsonResponse.payhub?.status === 'UP' &&
    jsonResponse.buildInfo?.project === 'ccpay' &&
    jsonResponse.buildInfo?.name === 'ccpay-bubble-frontend'
  ) {
    console.log('Health check passed!');
  } else {
    throw new Error('Health check failed: Response does not match expected output');
  }
}).timeout(30000);
