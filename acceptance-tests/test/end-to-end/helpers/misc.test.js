'use strict';

const assert = require('assert');
const misc = require('./misc');

function fakeActor() {
  return {
    async usePlaywrightTo(_label, action) {
      await action({
        page: {
          async waitForFunction() {}
        }
      });
    }
  };
}

function fakeCaseSearch(headerValue = 'No matching cases found') {
  return {
    searchCalls: [],
    searchCaseUsingCcdNumber(searchOption) {
      this.searchCalls.push(['ccd', searchOption]);
    },
    searchCaseUsingDcnNumber(searchOption) {
      this.searchCalls.push(['dcn', searchOption]);
    },
    searchCaseUsingPaymentRef(searchOption) {
      this.searchCalls.push(['rc', searchOption]);
    },
    async getHeaderValue() {
      return headerValue;
    }
  };
}

describe('misc search helpers', () => {
  it('lets callers assert an expected no-match search result', async () => {
    const CaseSearch = fakeCaseSearch('Search for a case');

    await misc.multipleSearch(CaseSearch, fakeActor(), '1111222233334444');

    assert.deepStrictEqual(CaseSearch.searchCalls, [
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444']
    ]);
  });

  it('lets refund search callers assert an expected no-match search result', async () => {
    const CaseSearch = fakeCaseSearch();

    await misc.multipleSearchForRefunds(CaseSearch, null, fakeActor(), '1111222233334444');

    assert.deepStrictEqual(CaseSearch.searchCalls, [['ccd', '1111222233334444']]);
  });
});
