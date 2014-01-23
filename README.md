adyen
==========
npm module for the Adyen Payment service


## Installation

    $ npm install adyen
## Example for HPP

    // Init payment
    var
      HPP = require('adyen').HPP;
    
      hppPayment = new HPP({
        test: true,                                       
    
        HMACKey: 'YourHMAC_Key',                          
    
        // merchantReference: 'DummyPaymentID'            
        paymentAmount: 1000,                              
        currencyCode: 'EUR',                              
        // shipBeforeDate: 'YYYY-MM-DD'                   
    
        skinCode: 'YourSkinCode',                         
        merchantAccount: 'YourMerchantAccountName',       
        // sessionValidity: 'YYYY-MM-DD'                  
    
        shopperLocale: 'nl_NL',                           
    
        orderData: 'XY 1 year subscription',              
        countryCode: 'NL'                                 
        // shopperReference                               
        // blockedMethods                                 
        // offset                                         
      });
      
    
    
    // Get URL
    hppPayment.generateRequest(function (err, url, merchantReference) {
      if (err) {
        return console.error(err);
      }
    
      console.log(merchantReference);
      console.log(url);
    });
    
## TODO
- test
- add more payment method