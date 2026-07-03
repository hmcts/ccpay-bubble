'use strict';

const assert = require('assert');
const misc = require('./misc');

function fakeActor(bodyText = 'No matching cases found') {
  const actor = {
    searchOutcomeTimeout: undefined,
    async usePlaywrightTo(_label, action) {
      return action({
        page: {
          async waitForFunction(predicate, expected, options = {}) {
            actor.searchOutcomeTimeout = options.timeout;
            const document = { body: { innerText: bodyText } };
            const matched = Function('document', 'expected', `return (${predicate.toString()})(expected);`)(document, expected);
            if (!matched) {
              throw new Error(`Search outcome was not recognised from: ${bodyText}`);
            }
            return {
              async jsonValue() {
                return matched;
              }
            };
          }
        }
      });
    }
  };
  return actor;
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
  it('lets explicit no-match callers assert an expected no-match search result', async () => {
    const CaseSearch = fakeCaseSearch('Search for a case');
    const I = fakeActor();

    await misc.multipleSearch(CaseSearch, I, '1111222233334444', { allowNoMatch: true });

    assert.deepStrictEqual(CaseSearch.searchCalls, [['ccd', '1111222233334444']]);
  });

  it('retries positive searches before failing on no-match results', async () => {
    const CaseSearch = fakeCaseSearch('Search for a case');
    const I = fakeActor();

    await assert.rejects(
      () => misc.multipleSearch(CaseSearch, I, '1111222233334444'),
      /Case search returned no matching cases for 1111222233334444/
    );

    assert.deepStrictEqual(CaseSearch.searchCalls, [
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444'],
      ['ccd', '1111222233334444']
    ]);
  });

  it('recognises the rendered payments table as a case transaction search result', async () => {
    const CaseSearch = fakeCaseSearch();
    const pageText = 'Payments Status Amount Date Payment reference Refunds No refunds recorded';

    await misc.multipleSearch(CaseSearch, fakeActor(pageText), '1111222233334444');

    assert.deepStrictEqual(CaseSearch.searchCalls, [['ccd', '1111222233334444']]);
  });

  it('keeps case-search polling bounded without fixed sleeps', async () => {
    const CaseSearch = fakeCaseSearch();
    const I = fakeActor('Case transactions');

    await misc.multipleSearch(CaseSearch, I, '1111222233334444');

    assert.strictEqual(I.searchOutcomeTimeout, 60000);
  });
});
