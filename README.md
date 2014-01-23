adyen
==========
![alt tag](https://api.travis-ci.org/hekike/adyen-node.png)
npm module for the Adyen Payment service


## Installation

    $ npm install adyen
## Example for HPP

    // Init payment
    var
      HPP = require('adyen').HPP;
    
      hppPayment = new HPP({
        test: true,                                     // optional: true for Adyen test environment
    
        HMACKey: 'YourHMAC_Key',                          
    
        merchantReference: 'DummyPaymentID',            // optional, default: 'PAYMENT-YYYY-MM-DDThh:mm:ssTZD'
        paymentAmount: 100,                             // EUR 1,00 = 100
        currencyCode: 'EUR',                            // optional, default: 'EUR'
        shipBeforeDate: 2014-01-25                      // 'YYYY-MM-DD'
    
        skinCode: 'YourSkinCode',                         
        merchantAccount: 'YourMerchantAccountName',       
        sessionValidity: 'YYYY-MM-DD',                  // optional, default: 24h
    
        shopperLocale: 'nl_NL',                         // optional: 'en_US'
    
        orderData: 'XY 1 year subscription',            // optional: ''
        countryCode: 'NL'                               // optional: 'US'
        // shopperReference                             // optional: check the Adyen documentation
        // blockedMethods                               // optional: check the Adyen documentation
        // offset                                       // optional: check the Adyen documentation
      });
      
    
    
    // Get URL to the payment window
    hppPayment.generateRequest(function (err, url, merchantReference) {
      if (err) {
        return console.error(err);
      }
    
      console.log(merchantReference);
      console.log(url);
    });
    
## TODO
- add more payment method