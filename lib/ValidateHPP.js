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
  this._resp.merchantReferenceData = options.merchantReferenceData || '';
  this._resp.shopperLocale = options.shopperLocale || '';
  this._resp.paymentMethod = options.paymentMethod || '';

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
  var hmacText = [];
  var self = this;
  var key;

  var keys = [];

  for (key in this._request) {
    if (this._resp.hasOwnProperty(key) && this._resp[key]) {
      keys.push(key);
    }
  }

  keys.sort();

  keys.forEach(function(key) {
    hmacText.push(key);
  });

  keys.forEach(function(key) {
    var val = '' + self._resp[key];
    hmacText.push(val.replace(/\\/g, '\\\\').replace(/:/g, '\\:'));
  });

  hmacText = hmacText.join(':');

  hmac = crypto.createHmac('sha256', this._HMACKey);
  hmac.update(hmacText);

  return hmac.digest('base64');
};

Validate.prototype.validatePayment = function () {
  return this._resp.merchantSig === this.generatePaymentHash();
};

module.exports = Validate;
