const caseTransactionsText = 'Case transactions';
const noMatchingCasesText = 'No matching cases found';
const searchForCaseText = 'Search for a case';
const searchOutcomeTimeout = 10;

function searchSpecificOption(searchItem, CaseSearch, searchOption) {
  switch (searchItem) {
  case 'CCD Search': CaseSearch.searchCaseUsingCcdNumber(searchOption);
    break;

  case 'DCN Search': CaseSearch.searchCaseUsingDcnNumber(searchOption);
    break;

  case 'RC Search': CaseSearch.searchCaseUsingPaymentRef(searchOption);
    break;

  default: CaseSearch.searchCaseUsingCcdNumber(searchOption);
  }
}

function searchItemFor(searchOption) {
  let searchItem = '';
  const searchOptionLen = searchOption.toString().length;
  const ccdNumberLen = 16;
  const ccdNumberFormatLen = 19;
  const dcnLen = 21;
  const rcLen = 22;
  if ((searchOptionLen === ccdNumberLen) || (searchOptionLen === ccdNumberFormatLen)) {
    searchItem = 'CCD Search';
  } else if (searchOptionLen === dcnLen) {
    searchItem = 'DCN Search';
  } else if (searchOptionLen === rcLen) {
    searchItem = 'RC Search';
  }
  return searchItem;
}

async function waitForSearchOutcome(I) {
  await I.usePlaywrightTo('wait for case search outcome', async ({ page }) => {
    await page.waitForFunction(({ successText, notFoundText }) => {
      const bodyText = document.body.innerText;
      return bodyText.includes(successText) || bodyText.includes(notFoundText);
    }, { successText: caseTransactionsText, notFoundText: noMatchingCasesText }, {
      timeout: searchOutcomeTimeout * 1000
    });
  });
}

async function searchUntilFound(CaseSearch, I, searchOption) {
  const searchItem = searchItemFor(searchOption);

  searchSpecificOption(searchItem, CaseSearch, searchOption);
  await waitForSearchOutcome(I);
}

async function multipleSearchForRefunds(CaseSearch, CaseTransaction, I, searchOption) {
  await searchUntilFound(CaseSearch, I, searchOption);
}

async function multipleSearch(CaseSearch, I, searchOption) {
  const searchItem = searchItemFor(searchOption);
  await searchUntilFound(CaseSearch, I, searchOption);
  for (let attempt = 0; attempt < 4; attempt++) {
    const headerValue = await CaseSearch.getHeaderValue();
    if (headerValue === searchForCaseText) {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
      await waitForSearchOutcome(I);
    }
  }
}

module.exports = { multipleSearch, multipleSearchForRefunds };
