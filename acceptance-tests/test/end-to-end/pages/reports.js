'use strict';

const { Logger } = require('@hmcts/nodejs-logging');
const assert = require('assert');

const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const stringUtil = require('../helpers/string_utils');

const logger = Logger.getLogger('helpers/utils');
const { I } = inject();

const todayDate = stringUtil.getTodayDateInYYYYMMDD();

module.exports = {
  locators: {
    data_loss: { xpath: '//*[@id="DataLoss"]' },
    unprocessed_transaction: { xpath: '//*[@id="UnprocessedTransactions"]' },
    processed_unallocated: { xpath: '//*[@id="ProcessedUnallocated"]' },
    shortfall_and_surplus: { xpath: '//*[@id="ShortfallsandSurplus"]' },
    payment_failure_event: { xpath: '//*[@id="PaymentFailureEvent"]' },
    telephony_payments: { xpath: '//*[@id="TelephonyPayments"]' },
    refunds: { xpath: '//*[@id="RefundsEvent"]' }
  },

  navigateToReports() {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Reports');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  validateReportsPage() {
    I.see('Choose the report type and date range');
    I.see('Data loss');
    I.see('Missing transactions where data has been received from only either of Exela or Bulk scan');
    I.see('Unprocessed transactions');
    I.see('Transaction records that are still unprocessed by staff.');
    I.see('Processed unallocated');
    I.see('Payments that are marked as ‘Unidentified’ or ‘Transferred’ (Unsolicited requests)');
    I.see('Under payment and Over payment');
    I.see('Failed payment transaction details');
    I.see('All Telephony Payments');
    I.see('Date from');
    I.see('Date to');
    I.see('Download report');
  },

  async selectReportAndDownload(report, dateFrom = todayDate, dateTo = todayDate) {
    switch (report) {
    case 'Data loss':
      I.checkOption(this.locators.data_loss);
      break;
    case 'Unprocessed transactions':
      I.checkOption(this.locators.unprocessed_transaction);
      break;
    case 'Processed unallocated':
      I.checkOption(this.locators.processed_unallocated);
      break;
    case 'Under payment and Over payment':
      I.checkOption(this.locators.shortfall_and_surplus);
      break;
    case 'Payment failure event':
      I.checkOption(this.locators.payment_failure_event);
      break;
    case 'Telephony Payments':
      I.checkOption(this.locators.telephony_payments);
      break;
    case 'Refunds':
      I.checkOption(this.locators.refunds);
      break;
    default:
      logger.log('Enter valid report name');
      return;
    }

    I.wait(CCPBConstants.twoSecondWaitTime);

    const fromMax = await I.grabAttributeFrom('#date-from', 'max');
    const toMax = await I.grabAttributeFrom('#date-to', 'max');

    // Deterministic: use Playwright native fill for <input type="date">.
    await I.usePlaywrightTo('set report dates', async ({ page }) => {
      const from = page.locator('#date-from');
      const to = page.locator('#date-to');

      await from.waitFor({ state: 'visible' });
      await to.waitFor({ state: 'visible' });

      await from.fill(dateFrom);
      await to.fill(dateTo);

      await from.evaluate((el) => el.blur());
      await to.evaluate((el) => el.blur());
    });

    // Read back and assert
    const actualFrom = await I.grabValueFrom('#date-from');
    const actualTo = await I.grabValueFrom('#date-to');

    assert.strictEqual(actualFrom, dateFrom, 'reports date-from value mismatch');
    assert.strictEqual(actualTo, dateTo, 'reports date-to value mismatch');

    I.wait(CCPBConstants.twoSecondWaitTime);
    I.click('Download report');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }
};
