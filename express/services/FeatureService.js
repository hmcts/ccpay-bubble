const config = require('config');
const { fetchWithAuth } = require("./UtilService");

const payhubUrl = config.get('payhub.url');

class FeatureService {
  async getFeatures(req) {
    const url = `${payhubUrl}/api/ff4j/store/features`;
    const resp = await fetchWithAuth(url, req.authToken);
    return resp.json();
  }
}

module.exports = FeatureService;
