const config = require('config');
const request = require('request-promise-native');

const payhubUrl = config.get('payhub.url');

class FeatureService {
  getFeatures(req, token) {
    return request.get({
      uri: `${payhubUrl}/api/ff4j/store/features`,
      headers: {
        Authorization: `Bearer ${req.authToken}`,
        ServiceAuthorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true
    });
  }
}

module.exports = FeatureService;
