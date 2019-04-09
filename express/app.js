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

  .get('/payments/:ref', (req, res) => {
    console.log('here');
    res.status(200).send({
      account_number: 'RFK-123',
      amount: 0,
      case_reference: '1111_2222_3333_4444',
      ccd_case_number: '1111_2222_3333_4444',
      channel: 'Divorce',
      currency: 'GBP',
      customer_reference: 'CUS-123',
      date_created: '2012-10-01T09:45:00.000UTC+00:00',
      date_updated: '2012-12-01T09:45:00.000UTC+00:00',
      description: 'Test description',
      external_provider: 'EXTECO',
      external_reference: '1234-1234-1234-1234',
      fees: [
        {
          calculated_amount: 0,
          ccd_case_number: '1234-5678-1234-1111',
          code: '12345',
          memo_line: 'Memo line',
          natural_account_code: '123456',
          reference: '123',
          remission_reference: '123',
          version: '1.2',
          volume: 0
        }
      ],
      giro_slip_no: '123',
      id: '123',
      method: 'GET',
      organisation_name: 'SISCO',
      payment_group_reference: '1234542e23232',
      payment_reference: '3232321331231',
      reference: '323213123',
      reported_date_offline: '123232',
      service_name: 'Divorce',
      site_id: '90u90u90u',
      status: 'Open',
      status_histories: [
        {
          date_created: '2012-10-01T09:45:00.000UTC+00:00',
          date_updated: '2012-11-01T09:45:00.000UTC+00:00',
          error_code: '500',
          error_message: 'Something went wrong',
          external_status: '500',
          status: '200'
        }
      ]
    });
  })

  .get('/monitoring-tools', (req, res) => res.status(HttpStatus.OK).json({ key: config.get('appInsights.instrumentationKey') }));
