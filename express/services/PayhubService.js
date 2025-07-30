const config = require('config');
const UUID = require('uuid/v4');
const { fetchWithAuth, plainFetch } = require('./UtilService');
const FeatureService = require('./FeatureService');
const { URL, URLSearchParams } = require('url');

const payhubUrl = config.get('payhub.url');
const ccpayBubbleReturnUrl = config.get('ccpaybubble.url');
const pcipalAntennaReturnUrl = config.get('pcipalantenna.url');
const ccdUrl = config.get('ccd.url');
const CASE_REF_VALIDATION_ENABLED = 'caseref-validation';

class PayhubService {
  constructor() {
    this.featureService = new FeatureService();
  }

  async sendToPayhub(req) {
    const url = `${payhubUrl}/card-payments`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {'return-url': `${ccpayBubbleReturnUrl}`}
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postPaymentGroupToPayhub(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}/card-payments`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {'return-url': `${ccpayBubbleReturnUrl}`}
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postPaymentAntennaToPayHub(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}/telephony-card-payments`;
    req.body.return_url = pcipalAntennaReturnUrl;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postPaymentGroup(req) {
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    }
    const resp = await fetchWithAuth(`${payhubUrl}/payment-groups`, req.authToken, options)
    return resp.json();
  }

  async putPaymentGroup(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify(req.body),
    }
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postRemission(req) {
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    }
    const resp = await fetchWithAuth(`${payhubUrl}/remissions`, req.authToken, options);
    return resp.json();
  }

  async deleteFees(req) {
    const url = `${payhubUrl}/fees/${req.params.id}`;
    const options = {method: 'DELETE'}
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postPartialRemission(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}/fees/${req.params.feeId}/remissions`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    }
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postAllocatePayment(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}/bulk-scan-payments`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postBSPayments(req) {
    const url = `${payhubUrl}/payment-groups/bulk-scan-payments`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postPaymentAllocations(req) {
    const url = `${payhubUrl}/payment-allocations`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postStrategicPayment(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}/bulk-scan-payments-strategic`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postWoPGStrategicPayment(req) {
    const url = `${payhubUrl}/payment-groups/bulk-scan-payments-strategic`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async getPayment(req) {
    const url = `${payhubUrl}/payments/${req.params.id}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getFailureReport(req) {
    /* eslint-disable no-console */
    console.log(req, `${payhubUrl}/payment-failures/failure-report?date_from=${req.query.date_from}&date_to=${req.query.date_to}`);
    const url = new URL(`${payhubUrl}/payment-failures/failure-report`);
    url.search = new URLSearchParams({
      date_from: req.query.date_from,
      date_to: req.query.date_to
    }).toString();
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getTelephonyPaymentsReport(req) {
    /* eslint-disable no-console */
    console.log(req, `${payhubUrl}/telephony-payments/telephony-payments-report?date_from=${req.query.date_from}&date_to=${req.query.date_to}`);
    const url = new URL(`${payhubUrl}/telephony-payments/telephony-payments-report`);
    url.search = new URLSearchParams({
      date_from: req.query.date_from,
      date_to: req.query.date_to
    }).toString();
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getPaymentFailure(req) {
    const url = `${payhubUrl}/payment-failures/${req.params.id}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getPaymentGroup(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getPbaAccountList(req) {
    const resp = await fetchWithAuth(`${payhubUrl}/pba-accounts`, req.authToken);
    return resp.json();
  }

  async postPBAAccountPayment(req) {
    const url = `${payhubUrl}/service-request/${req.params.serviceRef}/pba-payments`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postWays2PayCardPayment(req) {
    const url = `${payhubUrl}/service-request/${req.params.serviceRef}/card-payments`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async getApportionPaymentGroup(req) {
    const url = `${payhubUrl}/payment-groups/fee-pay-apportion/${req.params.id}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async ccpayWebComponentIntegration(req) {
    const url = `${payhubUrl}/${req.params[0]}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async getSelectedReport(req) {
    const url = new URL(`${payhubUrl}/payment/bulkscan-data-report`);
    url.search = new URLSearchParams({
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      report_type: req.query.report_type
    }).toString();
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }

  async validateCaseReference(req) {
    const url = `${ccdUrl}/cases/${req.params.caseref.replace(/-/g, '')}`;
    const options = {
      headers: {
        experimental: 'true',
        accept: 'application/vnd.uk.gov.hmcts.ccd-data-store-api.case.v2+json;charset=UTF-8'
      }
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  getBSfeature(req) {
    return this.featureService.getFeatures(req);
  }

  getFees() {
    return plainFetch(config.get('fee.feeRegistrationUrl'));
  }

  isCaseRefValidationEnabled(features) {
    const regFeature = features.find(feature => feature.uid === CASE_REF_VALIDATION_ENABLED);
    return regFeature ? regFeature.enable : false;
  }

  async getPartyDetails(req) {
    const url = `${payhubUrl}/case-payment-orders?case_ids=${req.query.case_ids}`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.buffer();
  }

  // refunds
  async postRefundsReason(req) {
    const url = `${payhubUrl}/refund-for-payment`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postPaymentGroupWithRetroRemissions(req) {
    const url = `${payhubUrl}/payment-groups/${req.params.paymentGroup}/fees/${req.params.feeId}/retro-remission`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  async postRefundRetroRemission(req) {
    const url = `${payhubUrl}/refund-retro-remission`;
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }

  getIdempotencyKey() {
    return UUID();
  }
}

module.exports = PayhubService;
