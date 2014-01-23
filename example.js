'use strict';

var
  HPP = require('./lib/adyen').HPP,

  hppPayment = new HPP({
    test: true,                                       // Use Adyen test env

    HMACKey: 'YourHMAC_Key',                          // Your HMAC Key

    // merchantReference: 'DummyPaymentID'            // optional, default: PAYMENT-YYYY-MM-DDThh:mm:ssTZD, The merchant reference is your reference for the payment
    paymentAmount: 1000,                              // Amount specified in minor units EUR 1,00 = 100
    currencyCode: 'EUR',                              // optional, default: EUR, The three-letter capitalised ISO currency code to pay in i.e. EUR
    // shipBeforeDate: 'YYYY-MM-DD'                   // optional, default: today

    skinCode: 'YourSkinCode',                         // The skin code that should be used for the payment
    merchantAccount: 'YourMerchantAccountName',       // The merchant reference is your reference for the payment
    // sessionValidity: 'YYYY-MM-DD'                  // optional, default: today + 1 day (tomorrow)

    shopperLocale: 'nl_NL',                           // optional, default: 'en_En',

    orderData: 'XY 1 year subscription',              // optional, A fragment of HTML/text that will be displayed on the HPP (optional)
    countryCode: 'NL'                                 // optional, default: 'US', Country code according to ISO_3166-1_alpha-2 standard  (optional),
    // shopperReference                               // optional, The shopper reference, i.e. the shopper ID (optional)
    // allowedMethods                                 // optional, Allowed payment methods separeted with a , i.e. "ideal,mc,visa" (optional)
    // blockedMethods                                 // optional, Blocked payment methods separeted with a , i.e. "ideal,mc,visa" (optional)
    // offset                                         // optional, Numeric value that will be added to the fraud score (optional)
  });

hppPayment.generateRequest(function (err, url, merchantReference) {
  if (err) {
    return console.error(err);
  }

  console.log(merchantReference);
  console.log(url);
});