/* Smoke test for the CCPayBubble application
   This test checks the health endpoint of the application to ensure it is up and running.
   It uses CodeceptJS.
*/
Feature('CCPayBubble Smoke Test');

Scenario('CCPayBubble Web Health Check Test', async ({ I }) => {
  I.amOnPage('/health'); // Navigate to the health endpoint

  // Extract the content of the <pre> tag
  const response = await I.executeScript(() => {
    const preElement = document.querySelector('pre');
    return preElement ? preElement.textContent : null;
  });

  if (!response) {
    throw new Error('Failed to extract JSON from the response');
  }

  console.log('Extracted JSON:', response); // Log the extracted JSON
  const jsonResponse = JSON.parse(response); // Parse the JSON response

  // Validate the JSON structure and values
  if (
    jsonResponse.status === 'UP' &&
    jsonResponse.payhub?.status === 'UP'
  ) {
    console.log('Health check passed!');
  } else {
    throw new Error('Health check failed: Response does not match expected output');
  }
}).timeout(5000);