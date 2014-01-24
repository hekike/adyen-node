/* jshint expr: true */
'use strict';

var
  expect = require('chai').expect,
  request = require('request'),
  HPP = require('./../lib/adyen').HPP;

describe('HPP', function () {
  var hppPayment;

  before(function () {
    hppPayment = new HPP({
      test: true,
      HMACKey: '123456',
      skinCode: 'Iix4eLo8',
      merchantAccount: 'JessePiscaerCOM',
      orderData: 'XY 1 year subscription',
      paymentAmount: 1000,
      currencyCode: 'EUR'
    });
  });

  describe('instance', function () {

    it('should not be undefined', function () {
      expect(hppPayment).not.to.be.undefined;
    });

    it('should throw error', function () {
      function validate() {
        new HPP();
      }

      expect(validate).to.throw(Error);
    });

    it('should generate url and merchantReference', function (done) {
      hppPayment.generateRequest(function (err, url, merchantReference) {
        expect(url).to.be.a('string');
        expect(merchantReference).to.be.a('string');
        expect(merchantReference).to.have.string('PAYMENT-');

        expect(url).to.match(/((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
        done();
      });
    });

    it('should be a valid payment window', function (done) {
      hppPayment.generateRequest(function (err, url, merchantReference) {
        request(url, function (err, res, body) {
          expect(body).to.have.string(merchantReference);
          expect(body).to.have.string('JessePiscaerCOM');
          expect(body).to.have.string('XY 1 year subscription');
          done();
        });
      });
    });
  });
});