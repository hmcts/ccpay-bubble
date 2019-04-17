const express = require('express');
const controllers = require('./mvc/controller');
const config = require('config');
const HttpStatus = require('http-status-codes');

module.exports = appInsights => express.Router()

  .post('/send-to-payhub', (req, res) => {
    controllers.payhubController.sendToPayhub(req, res, appInsights);
  })

  .post('/remission', (req, res) => {
    controllers.payhubController.postRemission(req, res, appInsights);
  })

  .get('/payments/:id', (req, res) => {
    controllers.payhubController.getPayment(req, res);
  })

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }));
