'use strict';

// TODO: Custom Payment method

var
  crypto = require('crypto'),
  zlib = require('zlib'),
  moment = require('moment');


var HPP = function (options) {

  options = options || {};

  // HMACKey
  if (!options.HMACKey) {
    throw new Error('HMAC key is required');
  }

  // paymentAmount
  if (!options.paymentAmount || isNaN(options.paymentAmount)) {
    throw new Error('paymentAmount is required and have to be a Number');
  }

  // skinCode
  if (!options.skinCode) {
    throw new Error('skinCode is required');
  }

  // merchantAccount
  if (!options.merchantAccount) {
    throw new Error('merchantAccount is required');
  }

  // merchantReference: optional
  if(options.merchantReference && options.merchantReference.length > 80) {
    throw new Error('merchantReference: The maximum length is 80 characters.');
  }

  // merchantReturnData: optional
  if(options.merchantReturnData && options.merchantReturnData.length > 128) {
    throw new Error('merchantReturnData: The maximum length is 128 characters.');
  }

  this._HMACKey = options.HMACKey;
  this._paymentPage = options.paymentPage || 'pay';

  this._url = 'https://live.adyen.com/hpp/' + this._paymentPage + '.shtml?';

  if (options.test === true) {
    this._url = 'https://test.adyen.com/hpp/' + this._paymentPage + '.shtml?';
  }

  this._orderData = options.orderData || '';

  this._request = {

    // Required for payment
    merchantReference: options.merchantReference || 'PAYMENT-' + moment().format('YYYY-MM-DDThh:mm:ssZ'),     // The merchant reference is your reference for the payment
    paymentAmount: options.paymentAmount,                                                                     // Amount specified in minor units EUR 1,00 = 100
    currencyCode: options.currencyCode || 'EUR',                                                              // The three-letter capitalised ISO currency code to pay in i.e. EUR
    shipBeforeDate: options.shipBeforeDate || moment().format('YYYY-MM-DD'),                                  // The date by which the goods or services are shipped. Format: YYYY-MM-DD
    skinCode: options.skinCode,                                                                               // The skin code that should be used for the payment
    merchantAccount: options.merchantAccount,                                                                 // The merchant account you want to process this payment with.
    sessionValidity: options.sessionValidity || moment().add('days', 1).format('YYYY-MM-DDThh:mm:ssZ'),       // The final time by which a payment needs to have been made. Format: YYYY-MM-DDThh:mm:ssZ

    // Optionals for payment
    shopperLocale: options.shopperLocale || 'en_US',                                                          // A combination of language code and country code to specify the language used in the session i.e. en_GB.
    orderData: null,                                                                                          // A fragment of HTML/text that will be displayed on the HPP (optional)
    merchantReturnData: options.merchantReturnData || null,                                                   // This field willl be passed back as-is on the return URL when the shopper
    countryCode: options.countryCode || null,                                                                 // Country code according to ISO_3166-1_alpha-2 standard  (optional)
    shopperEmail: options.shopperEmail || null,                                                               // The e-mailaddress of the shopper (optional)
    shopperReference: options.shopperReference || null,                                                       // The shopper reference, i.e. the shopper ID (optional)
    allowedMethods: options.allowedMethods || null,                                                           // Allowed payment methods separeted with a , i.e. "ideal,mc,visa" (optional)
    blockedMethods: options.blockedMethods || null,                                                           // Blocked payment methods separeted with a , i.e. "ideal,mc,visa" (optional)
    offset: options.offset || null,                                                                           // Numeric value that will be added to the fraud score (optional)
    offerEmail: options.offerEmail || null,
    shopperStatement: options.shopperStatement || null,
    skipSelection: options.skipSelection || false,
    brandCode: options.brandCode || null,

    // Signature for payment
    merchantSig: null                                                                                         // The HMAC signature used by Adyen to test the validy of the form;
  };
};


HPP.prototype.generateHash = function () {
  var
    hmac,
    hmacText,
    key;

  for (key in this._request) {
    if (this._request.hasOwnProperty(key) || this._request[key]) {
      hmacText += this._request[key];
    }
  }

  // Required fields
  hmacText =
      this._request.paymentAmount +
      this._request.currencyCode +
      this._request.shipBeforeDate +
      this._request.merchantReference +
      this._request.skinCode +
      this._request.merchantAccount +
      this._request.sessionValidity;

  // Optional fields
  hmacText += this._request.shopperEmail || '';
  hmacText += this._request.shopperReference || '';
  hmacText += this._request.allowedMethods || '';
  hmacText += this._request.blockedMethods || '';
  hmacText += this._request.shopperStatement || '';
  hmacText += this._request.merchantReturnData || '';
  hmacText += this._request.offset || '';

  hmac = crypto.createHmac('sha1', this._HMACKey);
  hmac.update(hmacText);

  this._request.merchantSig = hmac.digest('base64');
};

HPP.prototype.generateRequest = function (callback) {
  var
    requestUrl = this._url,
    _this = this;

  // Gzip encode
  zlib.gzip(this._orderData, function (err, buffer) {
    var key;

    if (err) {
      return callback(err);
    }

    // Base64 encode
    _this._request.orderData = buffer.toString('base64');

    // Generate sign hash
    _this.generateHash();

    // Build url
    for (key in _this._request) {
      if (_this._request.hasOwnProperty(key) && _this._request[key]) {
        requestUrl += '&' + key + '=' + encodeURIComponent(_this._request[key]);
      }
    }

    return callback(null, requestUrl, _this._request.merchantReference);
  });
};

module.exports = HPP;
