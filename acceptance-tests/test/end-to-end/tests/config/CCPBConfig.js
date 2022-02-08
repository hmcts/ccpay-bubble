module.exports = {
  TestCaseWorkerUserName: process.env.CASE_WORKER_USER_NAME || 'probatebackoffice@gmail.com',
  TestCaseWorkerPassword: process.env.CASE_WORKER_PASSWORD || 'Monday01',
  TestRefundsApproverUserName: process.env.REFUNDS_APPROVER_USER_NAME,
  TestRefundsApproverPassword: process.env.REFUNDS_APPROVER_PASSWORD,
  TestClientID: process.env.CLIENT_ID || 'cmc_citizen',
  TestClientSecret: process.env.OAUTH2_CLIENT_SECRET,
  TestRedirectURI: process.env.CLIENT_REDIRECT_URI || 'https://cmc-citizen-frontend.service.core-compute-aat.internal/receiver',
  TestAccountNumberActive: process.env.PBA_ACCOUNT_NUMBER_ACTIVE || 'PBAFUNC12345',
  TestAccountNumberInActive: process.env.PBA_ACCOUNT_NUMBER_INACTIVE || 'PBAFUNC12350',
  TestCMCSecret: process.env.CMC_S2S_SERVICE_SECRET,

  TestRunningEnvironment: process.env.RUNNING_ENV || 'preview',
  TestIDAMEnvironment: process.env.IDAM_ENV || 'aat',
  TestPrNumber: process.env.PR_NUMBER || 'pr-972'

};
