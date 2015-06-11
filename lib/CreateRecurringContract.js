'use strict';

var https = require ( 'https' );

var CONTRACTS = [ 'ONECLICK', 'RECURRING' ];

/**
 * Create Recurring Payment (JSON)
 *
 * You can submit a recurring payment using a specific recurringDetails record or by using the last created
 * recurringDetails record. The request for the recurring payment is done using a paymentRequest. This file shows how a
 * recurring payment can be submitted using our JSON API.
 *
 * Please note: using the Adyen API requires a web service user. Set up your Webservice user:
 * Adyen CA >> Settings >> Users >> ws@Company. >> Generate Password >> Submit
 *
 * A recurring payment can be submitted containing the following variables:
 *
 * - auth
 *     - login : your web service user
 *     - password : your web service user's password
 *
 * - merchantAccount    : The merchant account for which you want to process the payment.
 *
 * - selectedRecurringDetailReference : The recurringDetailReference you want to use for this payment.
 *                        The value LATEST can be used to select the most recently used recurring detail.
 * - recurringContract  : This should be the same value as recurringContract in the payment where the recurring
 *                        contract was created. However if ONECLICK,RECURRING was specified initially then this
 *                        field can be either ONECLICK or RECURRING.
 *
 * - paymentAmount       : The three character ISO currency code.
 * - currencyCode        : The transaction amount in minor units (e.g. EUR 1,00 = 100). (optional)
 *
 * - reference          : Your reference for this payment.
 * - shopperEmail       : The email address of the shopper. This does not have to match the email address
 *                        supplied with the initial payment since it may have changed in the mean time.
 * - shopperReference   : The reference to the shopper. This shopperReference must be the same as the
 *                        shopperReference used in the initial payment.
 * - shopperIP          : The shopper's IP address. (recommended)
 * - fraudOffset        : An integer that is added to the normal fraud score. (optional)
 * - cardCVC            : The card validation code. (only required for OneClick card payments)
 *
 * - test : true if you want to use the Adyen's test environment (optional, false by default)
 */
var RecurringContract = function ( options )
{
    options = options || {};

    // authentication
    if ( !options.auth || !options.auth.login )
    {
        throw new Error ( 'auth.login is required' );
    }
    if ( !options.auth.password )
    {
        throw new Error ( 'auth.password is required' );
    }

    // merchantAccount
    if ( !options.merchantAccount )
    {
        throw new Error ( 'merchantAccount is required' );
    }

    // selectedRecurringDetailReference
    if ( !options.selectedRecurringDetailReference )
    {
        throw new Error ( 'selectedRecurringDetailReference is required' );
    }

    // reference
    if ( !options.reference )
    {
        throw new Error ( 'reference is required' );
    }

    // shopperEmail
    if ( !options.shopperEmail )
    {
        throw new Error ( 'shopperEmail is required' );
    }

    // shopperReference
    if ( !options.shopperReference )
    {
        throw new Error ( 'shopperReference is required' );
    }

    // recurringContract
    if ( !options.recurringContract )
    {
        throw new Error ( 'recurringContract is required' );
    }
    else if ( CONTRACTS.indexOf ( options.recurringContract ) < 0 )
    {
        throw new Error ( 'recurringContract must be "ONECLICK" or "RECURRING"' );
    }
    if ( options.recurringContract === 'ONECLICK' )
    {
        // card CVC
        if ( !options.cardCVC )
        {
            throw new Error ( 'cardCVC is required for ONECLICK contract' );
        }
    }

    this._hostname = 'live.adyen.com';

    if ( options.test === true )
    {
        this._hostname = 'pal-test.adyen.com';
    }
    this._path = '/pal/servlet/Payment/v10/authorise';
    this._auth = options.auth.login + ':' + options.auth.password;

    this._merchantAccount = options.merchantAccount;
    this._shopperReference = options.shopperReference;
    this._recurringContract = options.recurringContract;
    this._shopperInteraction = this._recurringContract == 'OneClick' ? 'Ecommerce' : 'ContAuth';

    this._request = {
        merchantAccount: this._merchantAccount,
        selectedRecurringDetailReference: options.selectedRecurringDetailReference,
        recurring: {
            contract: this._recurringContract
        },
        shopperInteraction: this._shopperInteraction, // Set to ContAuth if the contract value is RECURRING, or Ecommerce if the contract value is ONECLICK.
        amount:{
            value: options.paymentAmount || '0',
            currency: options.currencyCode || 'EUR',
        },
        reference: options.reference,
        shopperEmail: options.shopperEmail,
        shopperReference: options.shopperReference,
        shopperIP: options.shopperIP || null,
        fraudOffset: options.fraudOffset || null,
        card: {
            cvc: options.cardCVC || null
        }
    }
};

/**
 * The recurring details response will contain the following fields:
 *
 * <pre>
 * - creationDate
 * - lastKnownShopperEmail
 * - shopperReference
 * - recurringDetail              : A list of zero or more details, containing:
 *     - recurringDetailReference : The reference the details are stored under.
 *     - variant                  : The payment method (e.g. mc, visa, elv, ideal, paypal).
 *                                  For some variants, like iDEAL, the sub-brand is returned like idealrabobank.
 *     - creationDate             : The date when the recurring details were created.
 *     - card                     : A container for credit card data.
 *     - elv                      : A container for ELV data.
 *     - bank                     : A container for BankAccount data.
 * </pre>
 *
 * The recurring contracts are stored in the same object types as you would have submitted in the initial
 * payment. Depending on the payment method one or more fields may be blank or incomplete (e.g. CVC for
 * card). Only one of the detail containers (card/elv/bank) will be returned per detail block, the others will
 * be null. For PayPal there is no detail container.
 *
 * Return an error object if the request fails:
 * {
 *   status: 422,
 *   errorCode: '803',
 *   message: 'PaymentDetail not found',
 *   errorType: 'validation'
 * }
 */
RecurringContract.prototype.create = function ( callback )
{
    var httpOptions = {};
    httpOptions.hostname = this._hostname;
    httpOptions.port = 443;
    httpOptions.path = this._path;
    httpOptions.method = "POST";
    httpOptions.auth = this._auth;
    httpOptions.headers = {
        "Content-Type": "application/json"
    };

    var req = https.request ( httpOptions, function ( res )
    {
        res.setEncoding ( 'utf8' );

        var body = '';

        res.on ( 'readable', function ()
        {
            body += this.read () || '';
        } );

        res.on ( 'end', function ()
        {
            var statusCode = res.statusCode,
                result     = JSON.parse ( body );

            if ( statusCode == 200 )
            {
                callback ( null, result );
            }
            else
            {
                callback ( result, null );
            }
        } );
    } );

    req.write ( JSON.stringify ( this._request ) );

    req.end ();
    req.on ( 'error', function ( e )
    {
        throw  new Error ( e );
    } );

};

module.exports = RecurringContract;
