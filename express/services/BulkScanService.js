const config = require('config');
const { URL, URLSearchParams } = require('url');

const { fetchWithAuth } = require("./UtilService");

const bulkScanUrl = config.get('bulkscan.url');

class BulkScanService {
  async getPaymentDetailsForDcn(req) {
    const url = new URL(`${bulkScanUrl}/cases`);
    url.search = new URLSearchParams({
      document_control_number: req.query.document_control_number
    }).toString();

    const response = await fetchWithAuth(url, req.authToken);
    return response.json();
  }

  async patchBSChangeStatus(req) {
    const url = `${bulkScanUrl}/bulk-scan-payments/${req.params.id}/status/${req.params[0]}`;
    const options = {method: 'PATCH'}
    const response = await fetchWithAuth(url, req.authToken, options);
    return response.json();
  }

  async getPaymentDetailsForCcd(req) {
    const url = `${bulkScanUrl}/cases/${req.params.id}`;
    const response = await fetchWithAuth(url, req.authToken);
    return response.json();
  }

  async getSelectedReport(req) {
    const url = new URL(`${bulkScanUrl}/report/data`);
    url.search = new URLSearchParams({
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      report_type: req.query.report_type
    }).toString();

    const response = await fetchWithAuth(url, req.authToken);
    return response.json();
  }
}

module.exports = BulkScanService;
