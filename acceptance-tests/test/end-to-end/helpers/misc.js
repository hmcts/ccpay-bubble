const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

async function multipleCcdSearch(CaseSearch, I, ccdCaseNumber) {
  const headerValue1 = await CaseSearch.getHeaderValue();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (headerValue1 === 'Search for a case') {
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue2 = await CaseSearch.getHeaderValue();
  if (headerValue2 === 'Search for a case') {
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }

  const headerValue3 = await CaseSearch.getHeaderValue();
  if (headerValue3 === 'Search for a case') {
    CaseSearch.searchCaseUsingCcdNumber(ccdCaseNumber);
  }
}


module.exports = { multipleCcdSearch };
