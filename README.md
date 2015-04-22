adyen
==========
[![Build Status](https://travis-ci.org/hekike/adyen-node.png?branch=master)](https://travis-ci.org/hekike/adyen-node)

Non official npm module for the Adyen Payment service.


## Installation

    $ npm install adyen

## What is HPP?

**Adyen Hosted Payment Pages (HPPs)**

For more information please check the Adyen's documenation
http://www.adyen.com/developers/documentation/

## Example for the HPP payment

    // Init payment
    var
      HPP = require('adyen').HPP;
    
      hppPayment = new HPP({
        test: true,                                     // optional: true for Adyen test environment
    
        HMACKey: 'YourHMAC_Key',                          

        // Required for the payment
        merchantReference: 'DummyPaymentID',            // optional (lib do this)
                                                        //    default: 'PAYMENT-YYYY-MM-DDThh:mm:ssTZD'
        paymentAmount: 100,                             // EUR 1,00 = 100
        currencyCode: 'EUR',                            // optional (lib do this), default: 'EUR'
        shipBeforeDate: 2014-01-25                      // 'YYYY-MM-DD'
        skinCode: 'YourSkinCode',                         
        merchantAccount: 'YourMerchantAccountName',       
        sessionValidity: 'YYYY-MM-DDThh:mm:ssZ',        // optional (lib do this), default: 24h

        // Optional for the payment
        shopperLocale: 'nl_NL',                         // optional: 'en_US'
        orderData: 'XY 1 year subscription',            // optional
        merchantReturnData: '',                         // optional
        countryCode: 'NL',                              // optional
        shopperEmail: 'test@test.com',                  // optional
        shopperReference: 'shopperID'                   // optional
        // allowedMethods                               // optional: check the Adyen documentation
        // blockedMethods                               // optional: check the Adyen documentation
        // offset                                       // optional: check the Adyen documentation
        // offerEmail                                   // optional: check the Adyen documentation
        // shopperStatement: ''                         // optional
        
        // if skipSelection is enabled the user will not be asked for a payment method but directly comes
        // to the payment page for the method specified by brandCode (e.g. paypal)
        // brandCode                                    // optional
        // skipSelection                                // optional
        
        // for redirecting the user to your custom page instead of the adyen confirmation page
        // resURL                                       // optional
      });
      
    
    
    // Get URL to the payment window
    hppPayment.generateRequest(function (err, url, merchantReference) {
      if (err) {
        return console.error(err);
      }
    
      console.log(merchantReference);
      console.log(url);
    });


## Example for the HPP validation

    // Init validator
    // Use the decodeURIComponent() values
    var
      ValidateHPP = require('adyen').ValidateHPP;

      validateHPP = new ValidateHPP({
        HMACKey: 'YourHMAC_Key',

        // Required for the validation
        skinCode: 'SkinCode From the callback url',
        authResult: 'STATUS From the callback url',
        pspReference: 'pspReference From the callback url',
        merchantReference: 'merchantReference From the callback url',
        merchantSig: 'merchantSig From the callback url'

        // Optional for the validation
        merchantReturnData: ''                          // optional
      });


      // true if valid
      var isValid = validateHPP.validatePayment();
      console.log(isValid);

## TODO
- custom HPP payment
- add more payment method
