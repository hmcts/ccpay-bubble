const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');
const bulkScanApiCalls = require('../helpers/utils');

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

async function multipleSearch(CaseSearch, I, searchOption) {
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

  I.wait(CCPBATConstants.fiveSecondWaitTime);
  searchSpecificOption(searchItem, CaseSearch, searchOption);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 === 'What do you want to search for?') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue5 = await CaseSearch.getHeaderValue();
    if (headerValue5 === 'What do you want to search for?') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 === 'What do you want to search for?') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue6 = await CaseSearch.getHeaderValue();
    if (headerValue6 === 'What do you want to search for?') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 === 'What do you want to search for?') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue7 = await CaseSearch.getHeaderValue();
    if (headerValue7 === 'What do you want to search for?') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 === 'What do you want to search for?') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue8 = await CaseSearch.getHeaderValue();
    if (headerValue8 === 'What do you want to search for?') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }
}

async function ccdSearchEnabledValidation(CaseSearch, I, ccdCaseNumber) {
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 !== 'What do you want to search for?') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 !== 'What do you want to search for?') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 !== 'What do you want to search for?') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 !== 'What do you want to search for?') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
}

module.exports = { multipleSearch, ccdSearchEnabledValidation };
