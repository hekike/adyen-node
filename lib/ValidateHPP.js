'use strict';

// TODO: Custom Payment method

var crypto = require('crypto');
var ACCEPTED_AUTH_RESULTS = ['AUTHORISED', 'REFUSED', 'CANCELLED', 'PENDING', 'ERROR'];

var Validate = function (options) {

  this._resp = {};

  // _HMACKey
  if (!options.HMACKey) {
    throw new Error('HMAC key is required');
  }

  this._HMACKey = options.HMACKey;

  // authResult
  if (!options.authResult) {
    throw new Error('authResult is required');
  }

  if(ACCEPTED_AUTH_RESULTS.indexOf(options.authResult) < 0) {
    throw new Error('authResult is required');
  }

  this._resp.authResult = options.authResult;

  // pspReference
  if (!options.pspReference) {
    throw new Error('pspReference is required');
  }

  this._resp.pspReference = options.pspReference;

  // merchantReference
  if (!options.merchantReference) {
    throw new Error('merchantReference is required');
  }

  this._resp.merchantReference = options.merchantReference;

  // skinCode
  if (!options.skinCode) {
    throw new Error('skinCode is required');
  }

  this._resp.skinCode = options.skinCode;

  // merchantSig
  if (!options.merchantSig) {
    throw new Error('merchantSig is required');
  }

  // merchantReturnData: Optional
  if (options.merchantReturnData) {
    this._resp.merchantReturnData = options.merchantReturnData;
  }

  this._resp.merchantSig = options.merchantSig;
};


Validate.prototype.generatePaymentHash = function () {
  var hmac;
  var hmacText;

  hmacText =
      this._resp.authResult +
      this._resp.pspReference +
      this._resp.merchantReference +
      this._resp.skinCode;

  hmacText += this._resp.merchantReturnData || '';

  hmac = crypto.createHmac('sha1', this._HMACKey);
  hmac.update(hmacText);

  return hmac.digest('base64');
};

Validate.prototype.validatePayment = function () {
  return this._resp.merchantSig === this.generatePaymentHash();
};

module.exports = Validate;
