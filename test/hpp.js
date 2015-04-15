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

        expect(url).to.contain('JessePiscaerCOM');
        expect(url).to.contain('EUR');
        expect(url).to.contain('Iix4eLo8');

        done();
      });
    });
  });
});