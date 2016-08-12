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
        recurringContract: 'RECURRING',                 // For recurring payments (see Adyen documentation)
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
        shopperLocale: 'shopperLocale From the callback url'
        paymentMethod: 'paymentMethod From the callback url'

        // Optional for the validation
        merchantReturnData: ''                          // optional
      });


      // true if valid
      var isValid = validateHPP.validatePayment();
      console.log(isValid);

## Example for Recurring Contract creation
    // Init validator
    var
      CreateRecurringContract = require('adyen').CreateRecurringContract;

    var createRecurringContract = new CreateRecurringContract ( {
        test: true,                                     // optional: true for Adyen test environment

        auth: {
            login: 'YourWSUser,
            password: 'YourWSPassword+4w?cQTJGs~EsPn9J'
        },

        merchantAccount: 'yourMerchantAccount',         // The merchant account you want to process this payment with.
        shopperEmail: 'test@test.com',
        shopperReference: 'shopperID',                  // Your unique ID for the shopper.
                                                        //    * This shopperReference must be the same as the shopperReference used in the initial payment.
        recurringContract: 'RECURRING',                 // The type of recurring contract to be used. "ONECLICK" or "RECURRING"
        selectedRecurringDetailReference: "LATEST",
        reference: "DummyPaymentID",
        paymentAmount: 100,                             // EUR 1,00 = 100
        currencyCode: 'EUR',                            // optional (lib do this), default: 'EUR'
        shopperIP: '111.222.111.222',                   // recommended: The shopper's IP address.
        // fraudOffset                                  // optional: An integer that is added to the normal fraud score.
        // cardCVC                                      // optional: The card validation code. (only required for OneClick card payments)
    } );

    // Create the recurring contract
    createRecurringContract.create ( function ( error, data )
    {
        if ( error )
        {
            console.log ( error );
        }

        console.log ( data );
    } );

## Example for retrieving a Recurring Contract
    // Init validator
    var
      RetrieveRecurringContract = require ( 'adyen' ).RetrieveRecurringContract;

    var
      retrieveRecurringContract = new RetrieveRecurringContract ( {
        test: true,                                       // Use Adyen test env

        auth: {
            login: 'YourWSUser,
            password: 'YourWSPassword+4w?cQTJGs~EsPn9J'
        },

        merchantAccount: 'yourMerchantAccount',           // The merchant account you want to process this payment with.
        shopperReference: 'shopperID',                    // Your unique ID for the shopper.
                                                          //    * This shopperReference must be the same as the shopperReference used in the initial payment.
        recurringContract: 'RECURRING'                    // The type of recurring contract to be used. "ONECLICK" or "RECURRING"
    } ),

  // Retrieve the recurring contract
  retrieveRecurringContract.list ( function ( error, data )
  {
        if ( error )
        {
            console.log ( error );
        }

        console.log ( data );
  } );

## Example for disabling a Recurring Contract
    // Init validator
    var
      DisableRecurringContract = require ( 'adyen' ).DisableRecurringContract;

    var
      disableRecurringContract = new DisableRecurringContract ( {
        test: true,                                       // Use Adyen test env

        auth: {
            login: 'YourWSUser,
            password: 'YourWSPassword+4w?cQTJGs~EsPn9J'
        },

        merchantAccount: 'yourMerchantAccount',                   // The merchant account you want to process this payment with.
        shopperReference: 'shopperID',                            // Your unique ID for the shopper.
                                                                  //    * This shopperReference must be the same as the shopperReference used in the initial payment.
        recurringDetailReference: 'yourRecurringDetailReference'  // The recurringDetailReference of the details you wish to disable. If you do
                                                                  //    * not supply this field all details for the shopper will be disabled including
                                                                  //    * the contract! This means that you can not add new details anymore.
    } ),

  // Disable the recurring contract
  disableRecurringContract.list ( function ( error, data )
  {
        if ( error )
        {
            console.log ( error );
        }

        console.log ( data );
  } );

## TODO
- custom HPP payment
- add more payment method
