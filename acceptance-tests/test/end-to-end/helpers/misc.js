const caseTransactionsText = 'Case transactions';
const paymentsText = 'Payments';
const paymentReferenceText = 'Payment reference';
const noMatchingCasesText = 'No matching cases found';
const searchErrorText = 'Something went wrong';
const searchForCaseText = 'Search for a case';
const searchOutcomeTimeout = 10;
const searchOutcomes = {
  caseFound: 'case-found',
  noMatch: 'no-match',
  retryableError: 'retryable-error'
};

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
  return I.usePlaywrightTo('wait for case search outcome', async ({ page }) => {
      const outcomeHandle = await page.waitForFunction(({ successText, paymentsText, paymentReferenceText, notFoundText, errorText, outcomes }) => {
        const bodyText = document.body.innerText;
        const hasCaseTransactionPage = bodyText.includes(successText) ||
          (bodyText.includes(paymentsText) && bodyText.includes(paymentReferenceText));
        if (hasCaseTransactionPage) {
          return outcomes.caseFound;
        }
        if (bodyText.includes(errorText)) {
          return outcomes.retryableError;
        }
        if (bodyText.includes(notFoundText)) {
          return outcomes.noMatch;
        }
        return false;
      }, { successText: caseTransactionsText, paymentsText, paymentReferenceText, notFoundText: noMatchingCasesText, errorText: searchErrorText, outcomes: searchOutcomes }, {
      timeout: searchOutcomeTimeout * 1000
    });
    return outcomeHandle.jsonValue();
  });
}

async function searchUntilFound(CaseSearch, I, searchOption, options = {}) {
  const searchItem = searchItemFor(searchOption);
  const maxSearchAttempts = 5;
  let lastOutcome;

  for (let attempt = 1; attempt <= maxSearchAttempts; attempt++) {
    searchSpecificOption(searchItem, CaseSearch, searchOption);
    const outcome = await waitForSearchOutcome(I);
    lastOutcome = outcome;

    if (outcome === searchOutcomes.caseFound || options.allowNoMatch) {
      return outcome;
    }

    // case_search waits around each submit; do not add another fixed delay here.
  }

  if (lastOutcome === searchOutcomes.retryableError) {
    throw new Error(`Case search failed with a rendered error for ${searchOption}`);
  }

  throw new Error(`Case search returned no matching cases for ${searchOption}`);
}

async function multipleSearchForRefunds(CaseSearch, CaseTransaction, I, searchOption) {
  await searchUntilFound(CaseSearch, I, searchOption);
}

async function multipleSearch(CaseSearch, I, searchOption, options = {}) {
  const outcome = await searchUntilFound(CaseSearch, I, searchOption, options);
  if (outcome !== searchOutcomes.caseFound) {
    return;
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const headerValue = await CaseSearch.getHeaderValue();
    if (headerValue === searchForCaseText) {
      await searchUntilFound(CaseSearch, I, searchOption, options);
    }
  }
}

module.exports = { multipleSearch, multipleSearchForRefunds };
