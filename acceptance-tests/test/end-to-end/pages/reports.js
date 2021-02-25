'use strict';
const { Logger } = require('@hmcts/nodejs-logging');

const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const logger = Logger.getLogger('helpers/utils');

const stringUtil = require('../helpers/string_utils');

const todayDate = stringUtil.getTodayDateInDDMMYYY();

const { I } = inject();

module.exports = {
  locators: {
    data_loss: { xpath: '//*[@id="DataLoss"]' },
    unprocessed_transaction: { xpath: '//*[@id="UnprocessedTransactions"]' },
    processed_unallocated: { xpath: '//*[@id="ProcessedUnallocated"]' },
    shortfall_and_surplus: { xpath: '//*[@id="ShortfallsandSurplus"]' },
    date_from: { xpath: '//*[@id="date-from"]' },
    date_to: { xpath: '//*[@id="date-to"]' }
  },
  // done
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
    I.see('Shortfalls and surplus');
    I.see('Requests where balances are marked as shortfall/surplus further case management. E.g: Refund approval, Customer contact');
    I.see('Date from');
    I.see('Date to');
    I.see('Download report');
  },

  selectReportAndDownload(report, dateFrom = todayDate, dateTo = todayDate) {
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
    case 'Shortfalls and surplus':
      I.checkOption(this.locators.shortfall_and_surplus);
      break;
    default:
      logger.log('Enter valid report name');
    }
    I.fillField(this.locators.date_to, dateTo);
    I.fillField(this.locators.date_from, dateFrom);
    I.wait(CCPBConstants.twoSecondWaitTime);
    I.click('Download report');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }
};
