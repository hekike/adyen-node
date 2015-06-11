'use strict';

var https = require ( 'https' );

var CONTRACTS = [ 'ONECLICK', 'RECURRING' ];

/**
 * Please note: using the Adyen API requires a web service user. Set up your Webservice user:
 * Adyen CA >> Settings >> Users >> ws@Company. >> Generate Password >> Submit
 *
 * A recurring contract can be submitted containing the following variables:
 *
 * - auth
 *     - login : your web service user
 *     - password : your web service user's password
 * - merchantAccount : the merchant account you want to process this payment with
 * - shopperReference : your unique ID for the shopper. This shopperReference must be the same as the shopperReference
 *                      used in the initial payment
 * - recurringContract : the type of recurring contract to be used. "ONECLICK" or "RECURRING"
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

    this._hostname = 'live.adyen.com';

    if ( options.test === true )
    {
        this._hostname = 'pal-test.adyen.com';
    }
    this._path = '/pal/servlet/Recurring/v10/listRecurringDetails';
    this._auth = options.auth.login + ':' + options.auth.password;

    this._merchantAccount = options.merchantAccount;
    this._shopperReference = options.shopperReference;
    this._recurringContract = options.recurringContract;

    this._request = {
        merchantAccount: this._merchantAccount,    // The merchant account you want to process this payment with.
        shopperReference: this._shopperReference,  // Your unique ID for the shopper. This shopperReference must be the same as the shopperReference used in the initial payment.
        recurring: {
            contract: this._recurringContract      // The type of recurring contract to be used. "ONECLICK" or "RECURRING"
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
RecurringContract.prototype.list = function ( callback )
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
