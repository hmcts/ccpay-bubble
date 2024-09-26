/* eslint-disable no-magic-numbers */
const { payhubService } = require('../../services');
const config = require('config');
const request = require('request-promise-native');
const LaunchDarkly = require('launchdarkly-node-client-sdk');
const HttpStatusCodes = require('http-status-codes');
const { Logger } = require('@hmcts/nodejs-logging');
const {errorHandler} = require("../../services/UtilService");

const ccpayBubbleLDclientId = config.get('secrets.ccpay.launch-darkly-client-id');
const LDprefix = config.get('environment.ldPrefix');
const currentEnv = config.get('environment.currentEnv');
const user = { key: `${LDprefix}@test.com` };
const constants = Object.freeze({ PCIPAL_SECURITY_INFO: '__pcipal-info' });

class PayhubController {
  constructor() {
    this.payhubService = payhubService;
  }

  sendToPayhub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        if (result._links.next_url) {
          request({
            method: 'GET',
            uri: result._links.next_url.href
          },
          (error, response, body) => {
            if (error) {
              return errorHandler(res, error);
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return errorHandler(res, error);
        }
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getLDFeatures(req, res) {
    const ldClient = LaunchDarkly.initialize(ccpayBubbleLDclientId, user);
    ldClient.on('ready', () => {
      const showFeature = ldClient.variation(req.query.flag, false);
      return res.status(200).send({ flag: showFeature, u: user, id: ccpayBubbleLDclientId });
    });
  }

  postPaymentGroupToPayHub(req, res, appInsights) {
    return this.payhubService.postPaymentGroupToPayhub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        if (result._links.next_url) {
          request({
            method: 'GET',
            uri: result._links.next_url.href
          },
          (error, response, body) => {
            if (error) {
              return errorHandler(res, error);
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return res.status(500).json({ err: `${error.message}`, success: false });
        }
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPaymentAntennaToPayHub(req, res, appInsights) {
    return this.payhubService.postPaymentAntennaToPayHub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        const pcipalData = {
          url: result._links.next_url.href,
          auth: result._links.next_url.accessToken,
          ref: result._links.next_url.refreshToken
        };
        res.cookie(constants.PCIPAL_SECURITY_INFO, pcipalData, { httpOnly: true });
        res.status(200).send('success');
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPaymentGroupListToPayHub(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        if (result._links.next_url) {
          request({
            method: 'GET',
            uri: result._links.next_url.href
          },
          (error, response, body) => {
            if (error) {
              return errorHandler(res, error);
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return errorHandler(res, error);
        }
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  sendToPayhubWithUrl(req, res) {
    if (req.body.url) {
      return request({
        method: 'GET',
        uri: req.body.url
      })
        .then(resp => {
          res.status(200).send(resp);
        })
        .catch(err => {
          return errorHandler(res, err);
        });
    }
    return Promise.reject(new Error('Missing url parameter')).catch(err => {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false });
    });
  }

  postCardPayment(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postStrategicPayment(req, res, appInsights) {
    return this.payhubService.postStrategicPayment(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postWoPGStrategicPayment(req, res, appInsights) {
    return this.payhubService.postWoPGStrategicPayment(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPaymentGroup(req, res, appInsights) {
    return this.payhubService.postPaymentGroup(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  putPaymentGroup(req, res, appInsights) {
    return this.payhubService.putPaymentGroup(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postRemission(req, res, appInsights) {
    return this.payhubService.postRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPartialRemission(req, res, appInsights) {
    return this.payhubService.postPartialRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postAllocatePayment(req, res, appInsights) {
    return this.payhubService.postAllocatePayment(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postBSPayments(req, res, appInsights) {
    return this.payhubService.postBSPayments(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPaymentAllocations(req, res, appInsights) {
    return this.payhubService.postPaymentAllocations(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getPayment(req, res) {
    return this.payhubService.getPayment(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  deleteFeesFromPaymentGroup(req, res, appInsights) {
    return this.payhubService.deleteFees(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getPbaAccountList(req, res) {
    return this.payhubService.getPbaAccountList(req)
      .then(result => {
        Logger.getLogger('Get-User-Details').info({ result });
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPBAAccountPayment(req, res, appInsights) {
    return this.payhubService.postPBAAccountPayment(req, appInsights)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  postWays2PayCardPayment(req, res, appInsights) {
    return this.payhubService.postWays2PayCardPayment(req, appInsights)
      .then(result => {
        Logger.getLogger('Get-User-Details').info({ result });
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getPaymentGroup(req, res) {
    return this.payhubService.getPaymentGroup(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getPaymentFailure(req, res) {
    return this.payhubService.getPaymentFailure(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getApportionPaymentGroup(req, res) {
    return this.payhubService.getApportionPaymentGroup(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  ccpayWebComponentIntegration(req, res) {
    return this.payhubService.ccpayWebComponentIntegration(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getSelectedReport(req, res) {
    return this.payhubService.getSelectedReport(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  bulkScanToggleFeature(req, res) {
    return this.payhubService.getBSfeature(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  validateCaseReference(req, res) {
    return this.payhubService.validateCaseReference(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getPartyDetails(req, res) {
    return this.payhubService.getPartyDetails(req)
      .then(result => {
        res.status(200).send(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }
  getFailureReport(req, res) {
    return this.payhubService.getFailureReport(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

    getTelephonyPaymentsReport(req, res) {
      return this.payhubService.getTelephonyPaymentsReport(req)
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          return errorHandler(res, error);
        });
    }

  // refunds
  postRefundsReason(req, res, appInsights) {
    return this.payhubService.postRefundsReason(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  postPaymentGroupWithRetroRemissions(req, res, appInsights) {
    return this.payhubService.postPaymentGroupWithRetroRemissions(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

  getEnvironment(res) {
    return res.status(200).send(currentEnv);
  }
  postRefundRetroRemission(req, res, appInsights) {
    return this.payhubService.postRefundRetroRemission(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        return errorHandler(res, error);
      });
  }

/*  errorHandler(res, error){
    let msg = "";
    if (error.message !== undefined && error.message !== ''){
      msg = error.message;
    }
    else if (error.cause !== undefined && error.cause !== ''){
      msg = error.cause;
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({ err: msg, success: false });
    } else {
      return res.status(500).json({ err: msg, success: false });
    }
  }*/
}

module.exports = PayhubController;
