'use strict';

var https = require ( 'https' );

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
 * - recurringDetailReference : The recurringDetailReference of the details you wish to disable. If you do
 *                              not supply this field all details for the shopper will be disabled including
 *                              the contract! This means that you can not add new details anymore.
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

    this._hostname = 'live.adyen.com';

    if ( options.test === true )
    {
        this._hostname = 'pal-test.adyen.com';
    }
    this._path = '/pal/servlet/Recurring/v10/disable';
    this._auth = options.auth.login + ':' + options.auth.password;

    this._merchantAccount = options.merchantAccount;
    this._shopperReference = options.shopperReference;
    this._recurringDetailReference = options.recurringDetailReference;

    this._request = {
        merchantAccount: this._merchantAccount,
        shopperReference: this._shopperReference,
        recurringDetailReference: this._recurringDetailReference || null
    }
};

/**
 * The response will be a result object with a single field response. If a single detail was disabled the value
 * of this field will be [detail-successfully-disabled] or, if all details are disabled, the value is
 * [all-details-successfully-disabled].
 *
 * Return an error object if the request fails:
 * {
 *   status: 422,
 *   errorCode: '803',
 *   message: 'PaymentDetail not found',
 *   errorType: 'validation'
 * }
 */
RecurringContract.prototype.disable = function ( callback )
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
