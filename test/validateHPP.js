/* jshint expr: true */
'use strict';

/*
 * Test return url from Adyen
 * merchantReference=PAYMENT-2014-01-24T10%3A32%3A33%2B01%3A00&skinCode=Iix4eLo8&shopperLocale=en_US&paymentMethod=bankTransfer_NL&authResult=PENDING&pspReference=8513905559646033&merchantSig=UTjYxg3fftV5m%2Bc9GNVNCWq4dvg%3D
 * console.log(decodeURIComponent('merchantReference=PAYMENT-2014-01-24T10%3A32%3A33%2B01%3A00&skinCode=Iix4eLo8&shopperLocale=en_US&paymentMethod=bankTransfer_NL&authResult=PENDING&pspReference=8513905559646033&merchantSig=UTjYxg3fftV5m%2Bc9GNVNCWq4dvg%3D'));
 */

var
  expect = require('chai').expect,
  ValidateHPP = require('./../lib/adyen').ValidateHPP;

describe('Validate HPP', function () {
  var validateHPP;

  before(function () {
    validateHPP = new ValidateHPP({
      HMACKey: '123456',
      skinCode: 'Iix4eLo8',
      authResult: 'PENDING',
      pspReference: '8513905559646033',
      merchantReference: 'PAYMENT-2014-01-24T10:32:33+01:00',
      merchantSig: 'UTjYxg3fftV5m+c9GNVNCWq4dvg='
    });
  });

  it('should not be undefined', function () {
    expect(validateHPP).not.to.be.undefined;
  });

  it('should throw error', function () {
    function validate() {
      new ValidateHPP();
    }

    expect(validate).to.throw(Error);
  });

  it('should be valid', function () {
    expect(validateHPP.validatePayment()).to.be.true;
  });
});