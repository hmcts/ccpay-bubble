const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');
const bulkScanApiCalls = require('../helpers/utils');


async function multipleCcdSearch(CaseSearch, I, ccdCaseNumber) {
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 === 'Search for a case') {
    await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
}

async function ccdSearchEnabledValidation(CaseSearch, I, ccdCaseNumber) {
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  const headerValue1 = await CaseSearch.getHeaderValue();
  if (headerValue1 === 'Case transactions') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 === 'Case transactions') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 === 'Case transactions') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue4 = await CaseSearch.getHeaderValue();
  if (headerValue4 === 'Case transactions') {
    CaseSearch.navigateToCaseTransaction();
    await bulkScanApiCalls.toggleOnCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
}

module.exports = { multipleCcdSearch, ccdSearchEnabledValidation };
