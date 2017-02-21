/* jshint expr: true */
'use strict';

var expect = require('chai').expect;
var HPP = require('./../lib/adyen').HPP;

describe('HPP', function () {
  var hppPayment;
  var zeroAmountPayment;

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

  before(function() {
    zeroAmountPayment = new HPP({
      test: true,
      HMACKey: '123456',
      skinCode: 'Iix4eLo8',
      merchantAccount: 'JessePiscaerCOM',
      paymentAmount: 0,
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

    it('should generate url and paymentData', function (done) {
      hppPayment.generateRequest(function (err, url, paymentData) {
        expect(url).to.be.a('string');
        expect(paymentData).to.be.a('object');
        expect(paymentData.merchantReference).to.have.string('PAYMENT-');
        
        expect(url).to.match(/((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);

        expect(url).to.contain('JessePiscaerCOM');
        expect(url).to.contain('EUR');
        expect(url).to.contain('Iix4eLo8');

        done();
      });
    });

    it('should accept zero amount payments', function(done) {
      zeroAmountPayment.generateRequest(function (err, url) {
        expect(url).to.be.a('string');

        expect(url).to.contain('paymentAmount');

        done();
      });
    });
  });
});
