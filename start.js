// const security = require('./express/infrastructure/security-factory');
const { enable } = require('./app-insights');

const appInsights = enable();

const app = require('./server')(appInsights),
  defaultPort = '3000',
  port = process.env.PORT || defaultPort,
  http = require('http');

// Disable cert errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// SSL handled at IIS level so Node.js app (iisnode) should be http only.
http.createServer(app).listen(port);
