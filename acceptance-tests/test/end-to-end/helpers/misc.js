const bulkScanApiCalls = require('../helpers/utils');

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

async function waitForSearchOutcome(I, searchOption) {
  await I.waitForFunction((successText, notFoundText) => {
    const bodyText = document.body.innerText;
    return bodyText.includes(successText) || bodyText.includes(notFoundText);
  }, [caseTransactionsText, noMatchingCasesText], searchOutcomeTimeout);

  const noMatchCount = await I.grabNumberOfVisibleElements(`//*[normalize-space()="${noMatchingCasesText}"]`);
  if (noMatchCount) {
    throw new Error(`Search completed but no matching case/payment was found for "${searchOption}"`);
  }
}

async function searchUntilFound(CaseSearch, I, searchOption) {
  const searchItem = searchItemFor(searchOption);

  searchSpecificOption(searchItem, CaseSearch, searchOption);
  await waitForSearchOutcome(I, searchOption);
}

async function multipleSearchForRefunds(CaseSearch, CaseTransaction, I, searchOption) {
  await searchUntilFound(CaseSearch, I, searchOption);
}

async function multipleSearch(CaseSearch, I, searchOption) {
  const searchItem = searchItemFor(searchOption);
  await searchUntilFound(CaseSearch, I, searchOption);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 === searchForCaseText) {
    const headerValue5 = await CaseSearch.getHeaderValue();
    if (headerValue5 === searchForCaseText) {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
      await waitForSearchOutcome(I, searchOption);
    }
  }

  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 === searchForCaseText) {
    const headerValue6 = await CaseSearch.getHeaderValue();
    if (headerValue6 === searchForCaseText) {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
      await waitForSearchOutcome(I, searchOption);
    }
  }

  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 === searchForCaseText) {
    const headerValue7 = await CaseSearch.getHeaderValue();
    if (headerValue7 === searchForCaseText) {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
      await waitForSearchOutcome(I, searchOption);
    }
  }

  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 === searchForCaseText) {
    const headerValue8 = await CaseSearch.getHeaderValue();
    if (headerValue8 === searchForCaseText) {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
      await waitForSearchOutcome(I, searchOption);
    }
  }
}

module.exports = { multipleSearch, multipleSearchForRefunds };
