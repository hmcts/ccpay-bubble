const express = require('express');
const controllers = require('./mvc/controller');
const config = require('config');
const HttpStatus = require('http-status-codes');

module.exports = appInsights => express.Router()

  // load payment types
  .post('/send-to-payhub', (req, res) => {
    controllers.payhubController.sendToPayhub(req, res, appInsights);
  })

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }));
