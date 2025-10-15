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
    req.body.return_url = this.buildRedirectCallBack(req);
    const options = {
      method: 'POST',
      body: JSON.stringify(req.body),
    };
    const resp = await fetchWithAuth(url, req.authToken, options);
    return resp.json();
  }



  /**
   * Builds a redirect callback URL for telephony payments based on the case number and case type.
   * Ensures null and undefined safety for both values and logs appropriate messages for debugging.
   *
   * @param {Object} req - The HTTP request object containing the body with case details.
   * @param {string} req.body.ccd_case_number - The unique identifier for the case.
   * @param {string} req.body.case_type - The type of the case (e.g., "GrantOfRepresentation").
   * @returns {string} - A full redirect URL if both values are present, otherwise the base URL.
   */
  buildRedirectCallBack(req) {
    const caseNumber = req?.body?.ccd_case_number;
    const caseType = req?.body?.case_type;
    const selectedOption = req?.body?.selected_option;

    // Check both values are not null or undefined
    if (caseNumber != null && caseType != null && selectedOption != null) {
      const urlPath = this.buildUrl(req)
      return pcipalAntennaReturnUrl.toString() + urlPath.toString();
    } else {
      // Log which value is missing for debugging
      if (caseNumber == null) {
        console.warn('Missing ccd_case_number in the request');
      }
      if (caseType == null) {
        console.warn('Missing case_type in the request');
      }
      console.warn('Default Telephony callback redirect is going to be used instead.');
      return pcipalAntennaReturnUrl;
    }
  }


  /**
   * Builds a case transaction URL using parameters from the request body.
   *
   * @param {Object} req - The HTTP request object.
   * @returns {string} A formatted URL string with query parameters.
   */
  buildUrl(req){

    const caseNumber = req?.body?.ccd_case_number;
    const caseType = req?.body?.case_type;
    const selectedOption = req?.body?.selected_option;
    const dcnNumber = req?.body?.dcn_number;
    const takePayment = req?.body?.take_payment;

    const isBulkScanning = this.getEnableOrDisable(req?.body?.is_bulk_scanning);
    const isStFixEnable = this.getEnableOrDisable(req?.body?.is_st_fix_enable);
    const isTurnOff = this.getEnableOrDisable(req?.body?.is_turn_off);
    const isPaymentStatusEnabled = this.getEnableOrDisable(req?.body?.is_payment_status_enabled);
    const excReference = req?.body?.exc_reference;

    const params = new URLSearchParams();

    if (selectedOption) {
      params.append('selectedOption', selectedOption);
    }
    if (excReference) {
      params.append('exceptionRecord', excReference);
    }
    if (dcnNumber) {
      params.append('dcn', dcnNumber);
    }
    params.append('view', 'case-transactions');

    if (takePayment) {
      params.append('takePayment', takePayment);
    }
    params.append('servicerequest', 'false');

    if (caseType) {
      params.append('caseType', caseType);
    }
    params.append('isBulkScanning', String(isBulkScanning));
    params.append('isStFixEnable', String(isStFixEnable));
    params.append('isTurnOff', String(isTurnOff));
    params.append('isPaymentStatusEnabled', String(isPaymentStatusEnabled));

    const url = `/${caseNumber}?${params.toString()}`;
    return url.toString();
  }


  getEnableOrDisable(value){
    if (value != null && (value == true || value == 'true')) {
      return 'Enable'
    }
    return 'Disable'
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
