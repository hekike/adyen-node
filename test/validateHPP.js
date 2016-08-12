/* jshint expr: true */
'use strict';

/*
 * Test return url from Adyen
 * authResult=AUTHORISED&merchantReference=PAYMENT-2016-08-04T03%3A59%3A49%2B02%3A00&merchantSig=ghU3YQgOm3iaGG6nO99C6PxUxcpaymFutAOQmR33QHo%3D&paymentMethod=visa&pspReference=8814703192495637&shopperLocale=en_US&skinCode=Q3FaI33C
 * console.log(decodeURIComponent('authResult=AUTHORISED&merchantReference=PAYMENT-2016-08-04T03%3A59%3A49%2B02%3A00&merchantSig=ghU3YQgOm3iaGG6nO99C6PxUxcpaymFutAOQmR33QHo%3D&paymentMethod=visa&pspReference=8814703192495637&shopperLocale=en_US&skinCode=Q3FaI33C'));
 */

var expect = require('chai').expect;
var ValidateHPP = require('./../lib/adyen').ValidateHPP;

describe('Validate HPP', function () {
  var validateHPP;

  before(function () {
    validateHPP = new ValidateHPP({
      HMACKey: 'A7CCEBC43D14B70990C5E056059059544800F3B21274FD847D269DC5965FB2F2',
      skinCode: 'Q3FaI33C',
      authResult: 'AUTHORISED',
      pspReference: '8814703192495637',
      merchantReference: 'PAYMENT-2016-08-04T03:59:49+02:00',
      merchantSig: 'ghU3YQgOm3iaGG6nO99C6PxUxcpaymFutAOQmR33QHo=',
      shopperLocale: 'en_US',
      paymentMethod: 'visa'
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
