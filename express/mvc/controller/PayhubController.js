const { payhubService } = require('../../services');
const config = require('config');
const request = require('request-promise-native');
const LaunchDarkly = require('launchdarkly-node-client-sdk');
const HttpStatusCodes = require('http-status-codes');
const sessionstorage = require('node-sessionstorage');

const ccpayBubbleLDclientId = config.get('secrets.ccpay.launch-darkly-client-id');
const LDprefix = config.get('environment.ldPrefix');
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
              return res.status(500).json({ err: `${error}`, success: false });
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return res.status(500).json({ err: `${error}`, success: false });
        }
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
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
              return res.status(500).json({ err: `${error}`, success: false });
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return res.status(500).json({ err: `${error}`, success: false });
        }
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }

  postPaymentAntennaToPayHub(req, res, appInsights) {
    return this.payhubService.postPaymentAntennaToPayHub(req, res, appInsights)
    // eslint-disable-next-line
    .then(result => {
        const pcipalDtata = {
          url: result._links.next_url.href,
          auth: result.access_token,
          ref: result.refresh_token
        };


        sessionstorage.setItem(constants.PCIPAL_SECURITY_INFO, pcipalDtata);
        res.status(200).send('success');
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
  getLDFeatures(req, res) {
    const ldClient = LaunchDarkly.initialize(ccpayBubbleLDclientId, user);
    ldClient.on('ready', () => {
      const showFeature = ldClient.variation(req.query.flag, false);
      return res.status(200).send({ flag: showFeature, u: user, id: ccpayBubbleLDclientId });
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
              return res.status(500).json({ err: `${error}`, success: false });
            }
            return res.status(200).send(body);
          });
        } else {
          const error = `Invalid json received from Payment Hub: ${JSON.stringify(result)}`;
          return res.status(500).json({ err: `${error}`, success: false });
        }
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
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
          res.status(500).json({ err, success: false });
        });
    }
    return Promise.reject(new Error('Missing url parameter')).catch(err => {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ err, success: false });
    });
  }

  postCardPayment(req, res, appInsights) {
    return this.payhubService.sendToPayhub(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  postPaymentGroup(req, res, appInsights) {
    return this.payhubService.postPaymentGroup(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  putPaymentGroup(req, res, appInsights) {
    return this.payhubService.putPaymentGroup(req, res, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  postRemission(req, res, appInsights) {
    return this.payhubService.postRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  postPartialRemission(req, res, appInsights) {
    return this.payhubService.postPartialRemission(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  postAllocatePayment(req, res, appInsights) {
    return this.payhubService.postAllocatePayment(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }
  postBSPayments(req, res, appInsights) {
    return this.payhubService.postBSPayments(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }
  postPaymentAllocations(req, res, appInsights) {
    return this.payhubService.postPaymentAllocations(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  getPayment(req, res) {
    return this.payhubService.getPayment(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  deleteFeesFromPaymentGroup(req, res, appInsights) {
    return this.payhubService.deleteFees(req, appInsights)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json({ err: error.message, success: false });
        } else {
          res.status(500).json({ err: error, success: false });
        }
      });
  }

  getPaymentGroup(req, res) {
    return this.payhubService.getPaymentGroup(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json(error.message);
        } else {
          res.status(500).json(error);
        }
      });
  }

  getApportionPaymentGroup(req, res) {
    return this.payhubService.getApportionPaymentGroup(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json(error.message);
        } else {
          res.status(500).json(error);
        }
      });
  }

  ccpayWebComponentIntegration(req, res) {
    return this.payhubService.ccpayWebComponentIntegration(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json(error.message);
        } else {
          res.status(500).json(error);
        }
      });
  }
  getSelectedReport(req, res) {
    return this.payhubService.getSelectedReport(req)
      .then(result => {
        res.status(200).json({ data: result, success: true });
      })
      .catch(error => {
        res.status(500).json({ err: error, success: false });
      });
  }
  bulkScanToggleFeature(req, res) {
    return this.payhubService.getBSfeature(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json(error.message);
        } else {
          res.status(500).json(error);
        }
      });
  }
  validateCaseReference(req, res) {
    return this.payhubService.validateCaseReference(req)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error => {
        if (error.statusCode) {
          res.status(error.statusCode).json(error.message);
        } else {
          res.status(500).json(error);
        }
      });
  }
}

module.exports = PayhubController;
