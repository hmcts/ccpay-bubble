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

function multipleSearchForRefunds(CaseSearch, CaseTransaction, I, searchOption) {
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
  await bulkScanApiCalls.toggleOffCaseValidation();
  searchSpecificOption(searchItem, CaseSearch, searchOption);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue5 = await CaseSearch.getHeaderValue();
    if (headerValue5 === 'Search for a case') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }

  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue6 = await CaseSearch.getHeaderValue();
    if (headerValue6 === 'Search for a case') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }

  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue7 = await CaseSearch.getHeaderValue();
    if (headerValue7 === 'Search for a case') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }

  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const headerValue8 = await CaseSearch.getHeaderValue();
    if (headerValue8 === 'Search for a case') {
      searchSpecificOption(searchItem, CaseSearch, searchOption);
    }
  }
}

async function ccdSearchEnabledValidation(CaseSearch, I, ccdCaseNumber) {
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 !== 'Search for a case') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 !== 'Search for a case') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 !== 'Search for a case') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 !== 'Search for a case') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
}

module.exports = { multipleSearch, multipleSearchForRefunds, ccdSearchEnabledValidation };
