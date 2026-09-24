const noMatchingCasesText = 'No matching cases found';
const searchErrorText = 'Something went wrong';
const searchForCaseText = 'Search for a case';
const searchOutcomeTimeout = 10;
const negativeSearchOutcomeMinWaitMs = 3000;
const searchResultNavigationTimeoutMs = 3000;
const defaultMaxSearchAttempts = 5;
const retryableErrorPauseSeconds = 2;
const searchOutcomes = {
  caseFound: 'case-found',
  noMatch: 'no-match',
  retryableError: 'retryable-error'
};

async function searchSpecificOption(searchItem, CaseSearch, searchOption) {
  switch (searchItem) {
  case 'CCD Search': await CaseSearch.searchCaseUsingCcdNumber(searchOption);
    break;

  case 'DCN Search': await CaseSearch.searchCaseUsingDcnNumber(searchOption);
    break;

  case 'RC Search': await CaseSearch.searchCaseUsingPaymentRef(searchOption);
    break;

  default: await CaseSearch.searchCaseUsingCcdNumber(searchOption);
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
      const outcomeWaitId = `case-search-${Date.now()}-${Math.random()}`;
      const outcomeHandle = await page.waitForFunction(({ notFoundText, errorText, outcomes, outcomeWaitId, negativeOutcomeMinWaitMs }) => {
        if (window.location.pathname.includes('/payment-history')) {
          return outcomes.caseFound;
        }

        const bodyText = document.body.innerText;
        window.__ccpaySearchOutcomeWaits = window.__ccpaySearchOutcomeWaits || {};
        if (!Object.prototype.hasOwnProperty.call(window.__ccpaySearchOutcomeWaits, outcomeWaitId)) {
          window.__ccpaySearchOutcomeWaits[outcomeWaitId] = performance.now();
        }
        if (performance.now() - window.__ccpaySearchOutcomeWaits[outcomeWaitId] < negativeOutcomeMinWaitMs) {
          return false;
        }
        if (bodyText.includes(errorText)) {
          return outcomes.retryableError;
        }
        if (bodyText.includes(notFoundText)) {
          return outcomes.noMatch;
        }
        return false;
      }, {
      notFoundText: noMatchingCasesText,
      errorText: searchErrorText,
      outcomes: searchOutcomes,
      outcomeWaitId,
      negativeOutcomeMinWaitMs: negativeSearchOutcomeMinWaitMs
    }, {
      timeout: searchOutcomeTimeout * 1000
    });
    return outcomeHandle.jsonValue();
  });
}

async function waitForSearchResultPage(I, timeoutMs = searchResultNavigationTimeoutMs) {
  return I.usePlaywrightTo('wait for case transaction route', async ({ page }) => {
    const isPaymentHistoryPage = () => new URL(page.url()).pathname.includes('/payment-history');

    if (isPaymentHistoryPage()) {
      return true;
    }

    if (timeoutMs <= 0) {
      return false;
    }

    try {
      await page.waitForURL(url => url.pathname.includes('/payment-history'), {
        timeout: timeoutMs,
        waitUntil: 'domcontentloaded'
      });
      return true;
    } catch (error) {
      return false;
    }
  });
}

async function recoverFromRetryableError(I, options, attempt, maxSearchAttempts) {
  if (attempt >= maxSearchAttempts) {
    return;
  }

  if (typeof options.onRetryableError === 'function') {
    await options.onRetryableError(attempt);
    return;
  }

  // Default recovery for transient rendered errors: refresh and wait briefly.
  if (typeof I.refreshPage === 'function') {
    await I.refreshPage();
  }

  if (typeof I.wait === 'function') {
    await I.wait(retryableErrorPauseSeconds);
  }
}

async function searchUntilFound(CaseSearch, I, searchOption, options = {}) {
  const searchItem = searchItemFor(searchOption);
  const configuredMaxAttempts = Number(options.maxSearchAttempts);
  const maxSearchAttempts = Number.isInteger(configuredMaxAttempts) && configuredMaxAttempts > 0
    ? configuredMaxAttempts
    : defaultMaxSearchAttempts;
  let lastOutcome;

  for (let attempt = 1; attempt <= maxSearchAttempts; attempt++) {
    if (await waitForSearchResultPage(I, 0)) {
      return searchOutcomes.caseFound;
    }

    await searchSpecificOption(searchItem, CaseSearch, searchOption);
    const outcome = await waitForSearchOutcome(I);
    lastOutcome = outcome;

    if (outcome === searchOutcomes.caseFound) {
      return outcome;
    }

    if (await waitForSearchResultPage(I)) {
      return searchOutcomes.caseFound;
    }

    if (outcome === searchOutcomes.noMatch && options.allowNoMatch) {
      return outcome;
    }

    if (outcome === searchOutcomes.retryableError) {
      await recoverFromRetryableError(I, options, attempt, maxSearchAttempts);
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
