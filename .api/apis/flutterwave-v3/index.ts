import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'flutterwave-v3/1.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * card
   *
   * @throws FetchError<400, types.PostV3ChargesResponse400> card - error
   */
  postV3Charges(body?: types.PostV3ChargesBodyParam, metadata?: types.PostV3ChargesMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesResponse200>> {
    return this.core.fetch('/v3/charges', 'post', body, metadata);
  }

  /**
   * Validate Charge
   *
   * @throws FetchError<400, types.PostV3ValidateChargeResponse400> Validate Charge - error
   */
  postV3ValidateCharge(metadata?: types.PostV3ValidateChargeMetadataParam): Promise<FetchResponse<200, types.PostV3ValidateChargeResponse200>> {
    return this.core.fetch('/v3/validate-charge', 'post', metadata);
  }

  /**
   * Create a Tokenized Charge
   *
   * @throws FetchError<400, types.PostV3TokenizedChargesResponse400> Sample Bad Request Error
   */
  postV3TokenizedCharges(metadata?: types.PostV3TokenizedChargesMetadataParam): Promise<FetchResponse<200, types.PostV3TokenizedChargesResponse200>> {
    return this.core.fetch('/v3/tokenized-charges', 'post', metadata);
  }

  /**
   * Create Bulk Tokenized Charge
   *
   * @throws FetchError<400, types.PostV3BulkTokenizedChargesResponse400> Sample Error Response
   */
  postV3BulkTokenizedCharges(body?: types.PostV3BulkTokenizedChargesBodyParam): Promise<FetchResponse<200, types.PostV3BulkTokenizedChargesResponse200>> {
    return this.core.fetch('/v3/bulk-tokenized-charges/', 'post', body);
  }

  /**
   * Get Bulk Tokenized Transactions
   *
   * @throws FetchError<400, types.GetV3BulkTokenizedChargesBulkIdTransactionsResponse400> Sample Error Response
   */
  getV3BulkTokenizedChargesBulk_idTransactions(metadata: types.GetV3BulkTokenizedChargesBulkIdTransactionsMetadataParam): Promise<FetchResponse<200, types.GetV3BulkTokenizedChargesBulkIdTransactionsResponse200>> {
    return this.core.fetch('/v3/bulk-tokenized-charges/{bulk_id}/transactions', 'get', metadata);
  }

  /**
   * Get status of Bulk Tokenized Charge
   *
   * @throws FetchError<400, types.GetV3BulkTokenizedChargesBulkIdResponse400> Sample Error Response
   */
  getV3BulkTokenizedChargesBulk_id(metadata: types.GetV3BulkTokenizedChargesBulkIdMetadataParam): Promise<FetchResponse<200, types.GetV3BulkTokenizedChargesBulkIdResponse200>> {
    return this.core.fetch('/v3/bulk-tokenized-charges/{bulk_id}', 'get', metadata);
  }

  /**
   * Update a Card Token
   *
   * @throws FetchError<400, types.PutV3TokensTokenResponse400> Error Example
   */
  putV3TokensToken(metadata: types.PutV3TokensTokenMetadataParam): Promise<FetchResponse<200, types.PutV3TokensTokenResponse200>> {
    return this.core.fetch('/v3/tokens/{token}', 'put', metadata);
  }

  /**
   * Capture a Charge
   *
   * @throws FetchError<400, types.PostV3ChargesFlwRefCaptureResponse400> Capture a Charge - error
   */
  postV3ChargesFlw_refCapture(body: types.PostV3ChargesFlwRefCaptureBodyParam, metadata: types.PostV3ChargesFlwRefCaptureMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefCaptureResponse200>>;
  postV3ChargesFlw_refCapture(metadata: types.PostV3ChargesFlwRefCaptureMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefCaptureResponse200>>;
  postV3ChargesFlw_refCapture(body?: types.PostV3ChargesFlwRefCaptureBodyParam | types.PostV3ChargesFlwRefCaptureMetadataParam, metadata?: types.PostV3ChargesFlwRefCaptureMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefCaptureResponse200>> {
    return this.core.fetch('/v3/charges/{flw_ref}/capture', 'post', body, metadata);
  }

  /**
   * Create a Refund
   *
   * @throws FetchError<400, types.PostV3ChargesFlwRefRefundResponse400> Create a Refund - error
   */
  postV3ChargesFlw_refRefund(body: types.PostV3ChargesFlwRefRefundBodyParam, metadata: types.PostV3ChargesFlwRefRefundMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefRefundResponse200>>;
  postV3ChargesFlw_refRefund(metadata: types.PostV3ChargesFlwRefRefundMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefRefundResponse200>>;
  postV3ChargesFlw_refRefund(body?: types.PostV3ChargesFlwRefRefundBodyParam | types.PostV3ChargesFlwRefRefundMetadataParam, metadata?: types.PostV3ChargesFlwRefRefundMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefRefundResponse200>> {
    return this.core.fetch('/v3/charges/{flw_ref}/refund', 'post', body, metadata);
  }

  /**
   * Void a Charge
   *
   * @throws FetchError<400, types.PostV3ChargesFlwRefVoidResponse400> Void a Charge - error
   */
  postV3ChargesFlw_refVoid(metadata: types.PostV3ChargesFlwRefVoidMetadataParam): Promise<FetchResponse<200, types.PostV3ChargesFlwRefVoidResponse200>> {
    return this.core.fetch('/v3/charges/{flw_ref}/void', 'post', metadata);
  }

  /**
   * Verify a Transaction
   *
   * @throws FetchError<400, types.GetV3TransactionsIdVerifyResponse400> Verify a Transaction - error
   */
  getV3TransactionsIdVerify(metadata: types.GetV3TransactionsIdVerifyMetadataParam): Promise<FetchResponse<200, types.GetV3TransactionsIdVerifyResponse200>> {
    return this.core.fetch('/v3/transactions/{id}/verify', 'get', metadata);
  }

  /**
   * Verify a transaction by Transaction reference
   *
   * @throws FetchError<400, types.GetV3TransactionsVerifyByReferenceResponse400> Verify a transaction by Transaction reference - error
   */
  getV3TransactionsVerify_by_reference(metadata?: types.GetV3TransactionsVerifyByReferenceMetadataParam): Promise<FetchResponse<200, types.GetV3TransactionsVerifyByReferenceResponse200>> {
    return this.core.fetch('/v3/transactions/verify_by_reference', 'get', metadata);
  }

  /**
   * Create a Refund
   *
   */
  postV3TransactionsIdRefund(metadata: types.PostV3TransactionsIdRefundMetadataParam): Promise<FetchResponse<200, types.PostV3TransactionsIdRefundResponse200>> {
    return this.core.fetch('/v3/transactions/{id}/refund', 'post', metadata);
  }

  /**
   * Get Multiple Transactions
   *
   */
  getV3Transactions(metadata?: types.GetV3TransactionsMetadataParam): Promise<FetchResponse<200, types.GetV3TransactionsResponse200>> {
    return this.core.fetch('/v3/transactions', 'get', metadata);
  }

  /**
   * Get all refunds
   *
   */
  getV3Refunds(): Promise<FetchResponse<200, types.GetV3RefundsResponse200>> {
    return this.core.fetch('/v3/refunds', 'get');
  }

  /**
   * Get Transactions Fees (Collections)
   *
   * @throws FetchError<400, types.GetV3TransactionsFeeResponse400> Get Transactions Fees (Collections) - error
   */
  getV3TransactionsFee(metadata?: types.GetV3TransactionsFeeMetadataParam): Promise<FetchResponse<200, types.GetV3TransactionsFeeResponse200>> {
    return this.core.fetch('/v3/transactions/fee', 'get', metadata);
  }

  /**
   * Resend Failed WebHooks
   *
   * @throws FetchError<400, types.PostV3TransactionsIdResendHookResponse400> Error response Resend Failed WebHooks
   */
  postV3TransactionsIdResendHook(metadata: types.PostV3TransactionsIdResendHookMetadataParam): Promise<FetchResponse<200, types.PostV3TransactionsIdResendHookResponse200>> {
    return this.core.fetch('/v3/transactions/{id}/resend-hook', 'post', metadata);
  }

  /**
   * View Transaction Timeline
   *
   */
  getV3TransactionsIdEvents(metadata: types.GetV3TransactionsIdEventsMetadataParam): Promise<FetchResponse<200, types.GetV3TransactionsIdEventsResponse200>> {
    return this.core.fetch('/v3/transactions/{id}/events', 'get', metadata);
  }

  /**
   * Initiate a Transfer
   *
   * @throws FetchError<400, types.PostV3TransfersResponse400> Account Resolve Error
   */
  postV3Transfers(metadata?: types.PostV3TransfersMetadataParam): Promise<FetchResponse<200, types.PostV3TransfersResponse200>> {
    return this.core.fetch('/v3/transfers', 'post', metadata);
  }

  /**
   * Fetch a Bulk Transfer
   *
   */
  getV3Transfers(metadata?: types.GetV3TransfersMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/v3/transfers', 'get', metadata);
  }

  /**
   * Retry a transfer
   *
   * @throws FetchError<400, types.PostV3TransfersIdRetriesResponse400> Sample Error Response
   */
  postV3TransfersIdRetries(metadata: types.PostV3TransfersIdRetriesMetadataParam): Promise<FetchResponse<200, types.PostV3TransfersIdRetriesResponse200>> {
    return this.core.fetch('/v3/transfers/{id}/retries', 'post', metadata);
  }

  /**
   * Fetch a Transfer Retry
   *
   */
  getV3TransfersIdRetries(metadata: types.GetV3TransfersIdRetriesMetadataParam): Promise<FetchResponse<200, types.GetV3TransfersIdRetriesResponse200>> {
    return this.core.fetch('/v3/transfers/{id}/retries', 'get', metadata);
  }

  /**
   * Create a Bulk Transfer
   *
   * @throws FetchError<400, types.PostV3BulkTransfersResponse400> Sample Error Response
   */
  postV3BulkTransfers(metadata?: types.PostV3BulkTransfersMetadataParam): Promise<FetchResponse<200, types.PostV3BulkTransfersResponse200>> {
    return this.core.fetch('/v3/bulk-transfers/', 'post', metadata);
  }

  /**
   * Get Transfer Fee
   *
   * @throws FetchError<400, types.GetV3TransfersFeeResponse400> Sample Error Response
   */
  getV3TransfersFee(metadata?: types.GetV3TransfersFeeMetadataParam): Promise<FetchResponse<200, types.GetV3TransfersFeeResponse200>> {
    return this.core.fetch('/v3/transfers/fee', 'get', metadata);
  }

  /**
   * Fetch a Transfer
   *
   * @throws FetchError<404, types.GetV3TransfersIdResponse404> Sample Error Response
   */
  getV3TransfersId(body: types.GetV3TransfersIdBodyParam, metadata: types.GetV3TransfersIdMetadataParam): Promise<FetchResponse<200, types.GetV3TransfersIdResponse200>>;
  getV3TransfersId(metadata: types.GetV3TransfersIdMetadataParam): Promise<FetchResponse<200, types.GetV3TransfersIdResponse200>>;
  getV3TransfersId(body?: types.GetV3TransfersIdBodyParam | types.GetV3TransfersIdMetadataParam, metadata?: types.GetV3TransfersIdMetadataParam): Promise<FetchResponse<200, types.GetV3TransfersIdResponse200>> {
    return this.core.fetch('/v3/transfers/{id}', 'get', body, metadata);
  }

  /**
   * Get Transfer Rates
   *
   */
  getV3TransfersRates(body?: types.GetV3TransfersRatesBodyParam, metadata?: types.GetV3TransfersRatesMetadataParam): Promise<FetchResponse<200, types.GetV3TransfersRatesResponse200>> {
    return this.core.fetch('/v3/transfers/rates', 'get', body, metadata);
  }

  /**
   * Create a Transfer Beneficiary
   *
   * @throws FetchError<400, types.PostV3BeneficiariesResponse400> Sample Error Response
   */
  postV3Beneficiaries(metadata?: types.PostV3BeneficiariesMetadataParam): Promise<FetchResponse<200, types.PostV3BeneficiariesResponse200>> {
    return this.core.fetch('/v3/beneficiaries', 'post', metadata);
  }

  /**
   * List all Transfer Beneficiaries
   *
   */
  getV3Beneficiaries(): Promise<FetchResponse<200, types.GetV3BeneficiariesResponse200>> {
    return this.core.fetch('/v3/beneficiaries', 'get');
  }

  /**
   * Fetch a Transfer Beneficiary
   *
   */
  getV3BeneficiariesId(metadata: types.GetV3BeneficiariesIdMetadataParam): Promise<FetchResponse<200, types.GetV3BeneficiariesIdResponse200>> {
    return this.core.fetch('/v3/beneficiaries/{id}', 'get', metadata);
  }

  /**
   * Delete a Transfer Beneficiary
   *
   * @throws FetchError<400, types.DeleteV3BeneficiariesIdResponse400> Sample Error Response
   */
  deleteV3BeneficiariesId(metadata: types.DeleteV3BeneficiariesIdMetadataParam): Promise<FetchResponse<200, types.DeleteV3BeneficiariesIdResponse200>> {
    return this.core.fetch('/v3/beneficiaries/{id}', 'delete', metadata);
  }

  /**
   * Create a Virtual Card
   *
   */
  postV3VirtualCards(metadata?: types.PostV3VirtualCardsMetadataParam): Promise<FetchResponse<200, types.PostV3VirtualCardsResponse200>> {
    return this.core.fetch('/v3/virtual-cards', 'post', metadata);
  }

  /**
   * Get all Virtual Cards
   *
   */
  getV3VirtualCards(metadata?: types.GetV3VirtualCardsMetadataParam): Promise<FetchResponse<200, types.GetV3VirtualCardsResponse200>> {
    return this.core.fetch('/v3/virtual-cards', 'get', metadata);
  }

  /**
   * Get a Virtual Card
   *
   */
  getV3VirtualCardsId(metadata: types.GetV3VirtualCardsIdMetadataParam): Promise<FetchResponse<200, types.GetV3VirtualCardsIdResponse200>> {
    return this.core.fetch('/v3/virtual-cards/{id}', 'get', metadata);
  }

  /**
   * Fund a Virtual Card
   *
   */
  postV3VirtualCardsIdFund(metadata: types.PostV3VirtualCardsIdFundMetadataParam): Promise<FetchResponse<200, types.PostV3VirtualCardsIdFundResponse200>> {
    return this.core.fetch('/v3/virtual-cards/{id}/fund', 'post', metadata);
  }

  /**
   * Withdraw from a virtual Card
   *
   */
  postV3VirtualCardsIdWithdraw(metadata: types.PostV3VirtualCardsIdWithdrawMetadataParam): Promise<FetchResponse<200, types.PostV3VirtualCardsIdWithdrawResponse200>> {
    return this.core.fetch('/v3/virtual-cards/{id}/withdraw', 'post', metadata);
  }

  /**
   * Block/Unblock a Virtual Card
   *
   */
  putV3VirtualCardsIdStatusStatus_action(metadata: types.PutV3VirtualCardsIdStatusStatusActionMetadataParam): Promise<FetchResponse<200, types.PutV3VirtualCardsIdStatusStatusActionResponse200>> {
    return this.core.fetch('/v3/virtual-cards/{id}/status/{status_action}', 'put', metadata);
  }

  /**
   * Terminate a Virtual Card
   *
   */
  putV3VirtualCardsIdTerminate(metadata: types.PutV3VirtualCardsIdTerminateMetadataParam): Promise<FetchResponse<200, types.PutV3VirtualCardsIdTerminateResponse200>> {
    return this.core.fetch('/v3/virtual-cards/{id}/terminate', 'put', metadata);
  }

  /**
   * Fetch a Virtual Card's Transactions
   *
   */
  getV3VirtualCardsIdTransactions(metadata: types.GetV3VirtualCardsIdTransactionsMetadataParam): Promise<FetchResponse<200, types.GetV3VirtualCardsIdTransactionsResponse200>> {
    return this.core.fetch('/v3/virtual-cards/{id}/transactions', 'get', metadata);
  }

  /**
   * Create a Virtual Account Number
   *
   * @throws FetchError<400, types.PostV3VirtualAccountNumbersResponse400> Sample Error Response
   */
  postV3VirtualAccountNumbers(metadata?: types.PostV3VirtualAccountNumbersMetadataParam): Promise<FetchResponse<200, types.PostV3VirtualAccountNumbersResponse200>> {
    return this.core.fetch('/v3/virtual-account-numbers', 'post', metadata);
  }

  /**
   * Create Bulk Virtual Account Numbers
   *
   * @throws FetchError<400, types.PostV3BulkVirtualAccountNumbersResponse400> Sample Error Response
   */
  postV3BulkVirtualAccountNumbers(metadata?: types.PostV3BulkVirtualAccountNumbersMetadataParam): Promise<FetchResponse<200, types.PostV3BulkVirtualAccountNumbersResponse200>> {
    return this.core.fetch('/v3/bulk-virtual-account-numbers', 'post', metadata);
  }

  /**
   * Fetch a Virtual Account Number
   *
   * @throws FetchError<400, types.GetV3VirtualAccountNumbersOrderRefResponse400> Sample Error Response
   */
  getV3VirtualAccountNumbersOrder_ref(metadata: types.GetV3VirtualAccountNumbersOrderRefMetadataParam): Promise<FetchResponse<200, types.GetV3VirtualAccountNumbersOrderRefResponse200>> {
    return this.core.fetch('/v3/virtual-account-numbers/{order_ref}', 'get', metadata);
  }

  /**
   * Update BVN
   *
   */
  putV3VirtualAccountNumbersOrder_ref(metadata: types.PutV3VirtualAccountNumbersOrderRefMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/v3/virtual-account-numbers/{order_ref}', 'put', metadata);
  }

  /**
   * Delete a Virtual Account Number
   *
   */
  postV3VirtualAccountNumbersOrder_ref(body: types.PostV3VirtualAccountNumbersOrderRefBodyParam, metadata: types.PostV3VirtualAccountNumbersOrderRefMetadataParam): Promise<FetchResponse<number, unknown>>;
  postV3VirtualAccountNumbersOrder_ref(metadata: types.PostV3VirtualAccountNumbersOrderRefMetadataParam): Promise<FetchResponse<number, unknown>>;
  postV3VirtualAccountNumbersOrder_ref(body?: types.PostV3VirtualAccountNumbersOrderRefBodyParam | types.PostV3VirtualAccountNumbersOrderRefMetadataParam, metadata?: types.PostV3VirtualAccountNumbersOrderRefMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/v3/virtual-account-numbers/{order_ref}', 'post', body, metadata);
  }

  /**
   * Fetch Bulk Virtual Account Details
   *
   * @throws FetchError<400, types.GetV3BulkVirtualAccountNumbersBatchIdResponse400> Sample Error Response
   */
  getV3BulkVirtualAccountNumbersBatch_id(metadata: types.GetV3BulkVirtualAccountNumbersBatchIdMetadataParam): Promise<FetchResponse<200, types.GetV3BulkVirtualAccountNumbersBatchIdResponse200>> {
    return this.core.fetch('/v3/bulk-virtual-account-numbers/{batch_id}', 'get', metadata);
  }

  /**
   * Create a collection subaccount
   *
   * @throws FetchError<400, types.PostV3SubaccountsResponse400> Missing Information Response
   */
  postV3Subaccounts(metadata?: types.PostV3SubaccountsMetadataParam): Promise<FetchResponse<200, types.PostV3SubaccountsResponse200>> {
    return this.core.fetch('/v3/subaccounts', 'post', metadata);
  }

  /**
   * Fetch all subaccounts
   *
   */
  getV3Subaccounts(metadata?: types.GetV3SubaccountsMetadataParam): Promise<FetchResponse<200, types.GetV3SubaccountsResponse200>> {
    return this.core.fetch('/v3/subaccounts', 'get', metadata);
  }

  /**
   * Fetch a Subaccount
   *
   * @throws FetchError<400, types.GetV3SubaccountsIdResponse400> Sample Error Response
   */
  getV3SubaccountsId(metadata: types.GetV3SubaccountsIdMetadataParam): Promise<FetchResponse<200, types.GetV3SubaccountsIdResponse200>> {
    return this.core.fetch('/v3/subaccounts/{id}', 'get', metadata);
  }

  /**
   * Update a subaccount
   *
   * @throws FetchError<400, types.PutV3SubaccountsIdResponse400> Sample Error Response
   */
  putV3SubaccountsId(metadata: types.PutV3SubaccountsIdMetadataParam): Promise<FetchResponse<200, types.PutV3SubaccountsIdResponse200>> {
    return this.core.fetch('/v3/subaccounts/{id}', 'put', metadata);
  }

  /**
   * Delete a subaccount
   *
   * @throws FetchError<400, types.DeleteV3SubaccountsIdResponse400> Sample Error Response
   */
  deleteV3SubaccountsId(metadata: types.DeleteV3SubaccountsIdMetadataParam): Promise<FetchResponse<200, types.DeleteV3SubaccountsIdResponse200>> {
    return this.core.fetch('/v3/subaccounts/{id}', 'delete', metadata);
  }

  /**
   * Create a Payout Subaccount
   *
   * @throws FetchError<400, types.PostV3PayoutSubaccountsResponse400> Sample Error Response
   */
  postV3PayoutSubaccounts(metadata?: types.PostV3PayoutSubaccountsMetadataParam): Promise<FetchResponse<200, types.PostV3PayoutSubaccountsResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts', 'post', metadata);
  }

  /**
   * List all Payout Subaccounts
   *
   */
  getV3PayoutSubaccounts(metadata?: types.GetV3PayoutSubaccountsMetadataParam): Promise<FetchResponse<200, types.GetV3PayoutSubaccountsResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts', 'get', metadata);
  }

  /**
   * Get a Payout Subaccount
   *
   * @throws FetchError<400, types.GetV3PayoutSubaccountsAccountReferenceResponse400> Sample Error Response
   */
  getV3PayoutSubaccountsAccount_reference(metadata: types.GetV3PayoutSubaccountsAccountReferenceMetadataParam): Promise<FetchResponse<200, types.GetV3PayoutSubaccountsAccountReferenceResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts/{account_reference}', 'get', metadata);
  }

  /**
   * Update a Payout Subaccount
   *
   * @throws FetchError<400, types.PutV3PayoutSubaccountsAccountReferenceResponse400> Sample Error Response
   */
  putV3PayoutSubaccountsAccount_reference(metadata: types.PutV3PayoutSubaccountsAccountReferenceMetadataParam): Promise<FetchResponse<200, types.PutV3PayoutSubaccountsAccountReferenceResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts/{account_reference}', 'put', metadata);
  }

  /**
   * Fetch Transactions
   *
   * @throws FetchError<400, types.GetV3PayoutSubaccountsAccountReferenceTransactionsResponse400> Sample Error Response
   */
  getV3PayoutSubaccountsAccount_referenceTransactions(metadata: types.GetV3PayoutSubaccountsAccountReferenceTransactionsMetadataParam): Promise<FetchResponse<200, types.GetV3PayoutSubaccountsAccountReferenceTransactionsResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts/{account_reference}/transactions', 'get', metadata);
  }

  /**
   * Fetch Available  Balance
   *
   * @throws FetchError<400, types.GetV3PayoutSubaccountsAccountReferenceBalancesResponse400> Sample Error Response
   */
  getV3PayoutSubaccountsAccount_referenceBalances(metadata: types.GetV3PayoutSubaccountsAccountReferenceBalancesMetadataParam): Promise<FetchResponse<200, types.GetV3PayoutSubaccountsAccountReferenceBalancesResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts/{account_reference}/balances', 'get', metadata);
  }

  /**
   * Fetch Static Virtual Accounts
   *
   * @throws FetchError<400, types.GetV3PayoutSubaccountsAccountReferenceStaticAccountResponse400> Sample Error Reference
   */
  getV3PayoutSubaccountsAccount_referenceStaticAccount(metadata: types.GetV3PayoutSubaccountsAccountReferenceStaticAccountMetadataParam): Promise<FetchResponse<200, types.GetV3PayoutSubaccountsAccountReferenceStaticAccountResponse200>> {
    return this.core.fetch('/v3/payout-subaccounts/{account_reference}/static-account', 'get', metadata);
  }

  /**
   * Get all Subscriptions
   *
   */
  getV3Subscriptions(metadata?: types.GetV3SubscriptionsMetadataParam): Promise<FetchResponse<200, types.GetV3SubscriptionsResponse200>> {
    return this.core.fetch('/v3/subscriptions', 'get', metadata);
  }

  /**
   * Activate a Subscription
   *
   * @throws FetchError<400, types.PutV3SubscriptionsIdActivateResponse400> Sample Error Response
   */
  putV3SubscriptionsIdActivate(metadata: types.PutV3SubscriptionsIdActivateMetadataParam): Promise<FetchResponse<200, types.PutV3SubscriptionsIdActivateResponse200>> {
    return this.core.fetch('/v3/subscriptions/{id}/activate', 'put', metadata);
  }

  /**
   * Deactivate a Subscription
   *
   * @throws FetchError<400, types.PutV3SubscriptionsIdCancelResponse400> Sample Error Response
   */
  putV3SubscriptionsIdCancel(metadata: types.PutV3SubscriptionsIdCancelMetadataParam): Promise<FetchResponse<200, types.PutV3SubscriptionsIdCancelResponse200>> {
    return this.core.fetch('/v3/subscriptions/{id}/cancel', 'put', metadata);
  }

  /**
   * Create a Payment Plan
   *
   */
  postV3PaymentPlans(metadata?: types.PostV3PaymentPlansMetadataParam): Promise<FetchResponse<200, types.PostV3PaymentPlansResponse200>> {
    return this.core.fetch('/v3/payment-plans', 'post', metadata);
  }

  /**
   * Get all Payment Plans
   *
   */
  getV3PaymentPlans(metadata?: types.GetV3PaymentPlansMetadataParam): Promise<FetchResponse<200, types.GetV3PaymentPlansResponse200>> {
    return this.core.fetch('/v3/payment-plans', 'get', metadata);
  }

  /**
   * Get a Payment Plan
   *
   */
  getV3PaymentPlansId(metadata: types.GetV3PaymentPlansIdMetadataParam): Promise<FetchResponse<200, types.GetV3PaymentPlansIdResponse200>> {
    return this.core.fetch('/v3/payment-plans/{id}', 'get', metadata);
  }

  /**
   * Update a Payment Plan
   *
   * @throws FetchError<400, types.PutV3PaymentPlansIdResponse400> Sample Plan Not Found Response
   */
  putV3PaymentPlansId(metadata: types.PutV3PaymentPlansIdMetadataParam): Promise<FetchResponse<200, types.PutV3PaymentPlansIdResponse200>> {
    return this.core.fetch('/v3/payment-plans/{id}', 'put', metadata);
  }

  /**
   * Cancel a Payment Plan
   *
   * @throws FetchError<400, types.PutV3PaymentPlansIdCancelResponse400> Sample No Plan Response
   */
  putV3PaymentPlansIdCancel(metadata: types.PutV3PaymentPlansIdCancelMetadataParam): Promise<FetchResponse<200, types.PutV3PaymentPlansIdCancelResponse200>> {
    return this.core.fetch('/v3/payment-plans/{id}/cancel', 'put', metadata);
  }

  /**
   * Get Supported Bill Categories
   *
   * @throws FetchError<400, types.GetV3TopBillCategoriesResponse400> Get Billers - Error response
   */
  getV3TopBillCategories(metadata?: types.GetV3TopBillCategoriesMetadataParam): Promise<FetchResponse<200, types.GetV3TopBillCategoriesResponse200>> {
    return this.core.fetch('/v3/top-bill-categories', 'get', metadata);
  }

  /**
   * Get Biller Details
   *
   * @throws FetchError<400, types.GetV3BillsCategoryBillersResponse400> Get Biller Details - Error response
   */
  getV3BillsCategoryBillers(metadata: types.GetV3BillsCategoryBillersMetadataParam): Promise<FetchResponse<200, types.GetV3BillsCategoryBillersResponse200>> {
    return this.core.fetch('/v3/bills/{category}/billers', 'get', metadata);
  }

  /**
   * Get a Bill Information
   *
   * @throws FetchError<400, types.GetV3BillersBillerCodeItemsResponse400> Get a Bill Information - Error response
   */
  getV3BillersBiller_codeItems(metadata: types.GetV3BillersBillerCodeItemsMetadataParam): Promise<FetchResponse<200, types.GetV3BillersBillerCodeItemsResponse200>> {
    return this.core.fetch('/v3/billers/{biller_code}/items', 'get', metadata);
  }

  /**
   * Validate customer details
   *
   * @throws FetchError<400, types.GetV3BillItemsCb141ValidateResponse400> Validate customer details - Error response
   */
  getV3BillItemsCb141Validate(metadata?: types.GetV3BillItemsCb141ValidateMetadataParam): Promise<FetchResponse<200, types.GetV3BillItemsCb141ValidateResponse200>> {
    return this.core.fetch('/v3/bill-items/CB141/validate', 'get', metadata);
  }

  /**
   * Create a Bill Payment
   *
   * @throws FetchError<400, types.PostV3BillersBillerCodeItemsItemCodePaymentResponse400> Create a Bill Payment - error
   */
  postV3BillersBiller_codeItemsItem_codePayment(metadata: types.PostV3BillersBillerCodeItemsItemCodePaymentMetadataParam): Promise<FetchResponse<200, types.PostV3BillersBillerCodeItemsItemCodePaymentResponse200>> {
    return this.core.fetch('/v3/billers/{biller_code}/items/{item_code}/payment', 'post', metadata);
  }

  /**
   * Get bill payments summary
   *
   */
  getV3BillsSummary(metadata?: types.GetV3BillsSummaryMetadataParam): Promise<FetchResponse<200, types.GetV3BillsSummaryResponse200>> {
    return this.core.fetch('/v3/bills/summary', 'get', metadata);
  }

  /**
   * Get a Bill Payment Status
   *
   * @throws FetchError<400, types.GetV3BillsReferenceResponse400> Get a Bill Payment Status - Error response
   */
  getV3BillsReference(metadata: types.GetV3BillsReferenceMetadataParam): Promise<FetchResponse<200, types.GetV3BillsReferenceResponse200>> {
    return this.core.fetch('/v3/bills/{reference}', 'get', metadata);
  }

  /**
   * Create Bulk Bills Payment
   *
   * @throws FetchError<400, types.PostV3BulkBillsResponse400> Create Bulk Bills Payment - error
   */
  postV3BulkBills(metadata?: types.PostV3BulkBillsMetadataParam): Promise<FetchResponse<200, types.PostV3BulkBillsResponse200>> {
    return this.core.fetch('/v3/bulk-bills', 'post', metadata);
  }

  /**
   * Get bill payments history
   *
   */
  getV3BillsHistory(metadata?: types.GetV3BillsHistoryMetadataParam): Promise<FetchResponse<200, types.GetV3BillsHistoryResponse200>> {
    return this.core.fetch('/v3/bills/history', 'get', metadata);
  }

  /**
   * Get all Banks
   *
   * @throws FetchError<404, types.GetV3BanksCountryResponse404> Sample Error Response
   */
  getV3BanksCountry(metadata: types.GetV3BanksCountryMetadataParam): Promise<FetchResponse<200, types.GetV3BanksCountryResponse200>> {
    return this.core.fetch('/v3/banks/{country}', 'get', metadata);
  }

  /**
   * Get Bank Branches
   *
   * @throws FetchError<404, types.GetV3BanksIdBranchesResponse404> No Branches Found Error Response
   */
  getV3BanksIdBranches(metadata: types.GetV3BanksIdBranchesMetadataParam): Promise<FetchResponse<200, types.GetV3BanksIdBranchesResponse200>> {
    return this.core.fetch('/v3/banks/{id}/branches', 'get', metadata);
  }

  /**
   * Get Multiple Wallet Balances
   *
   */
  getV3Balances(metadata?: types.GetV3BalancesMetadataParam): Promise<FetchResponse<200, types.GetV3BalancesResponse200>> {
    return this.core.fetch('/v3/balances', 'get', metadata);
  }

  /**
   * Get a Single Wallet Balance
   *
   */
  getV3BalancesCurrency(metadata: types.GetV3BalancesCurrencyMetadataParam): Promise<FetchResponse<200, types.GetV3BalancesCurrencyResponse200>> {
    return this.core.fetch('/v3/balances/{currency}', 'get', metadata);
  }

  /**
   * Resolve Account Details
   *
   * @throws FetchError<400, types.PostV3AccountsResolveResponse400> Sample Error Response
   */
  postV3AccountsResolve(metadata?: types.PostV3AccountsResolveMetadataParam): Promise<FetchResponse<200, types.PostV3AccountsResolveResponse200>> {
    return this.core.fetch('/v3/accounts/resolve', 'post', metadata);
  }

  /**
   * Resolve Card Bin
   *
   * @throws FetchError<400, types.GetV3CardBinsBinResponse400> Bin Not Found
   */
  getV3CardBinsBin(metadata: types.GetV3CardBinsBinMetadataParam): Promise<FetchResponse<200, types.GetV3CardBinsBinResponse200>> {
    return this.core.fetch('/v3/card-bins/{bin}', 'get', metadata);
  }

  /**
   * Get Balance History
   *
   */
  getV3WalletStatement(metadata?: types.GetV3WalletStatementMetadataParam): Promise<FetchResponse<200, types.GetV3WalletStatementResponse200>> {
    return this.core.fetch('/v3/wallet/statement', 'get', metadata);
  }

  /**
   * Initiate BVN Consent
   *
   * @throws FetchError<400, types.PostV3BvnVerificationsResponse400> Initiate BVN Consent - error
   */
  postV3BvnVerifications(body?: types.PostV3BvnVerificationsBodyParam): Promise<FetchResponse<200, types.PostV3BvnVerificationsResponse200>> {
    return this.core.fetch('/v3/bvn/verifications', 'post', body);
  }

  /**
   * Verify BVN Consent
   *
   * @throws FetchError<400, types.GetV3BvnVerificationsReferenceResponse400> Verify BVN Consent - error
   */
  getV3BvnVerificationsReference(metadata: types.GetV3BvnVerificationsReferenceMetadataParam): Promise<FetchResponse<200, types.GetV3BvnVerificationsReferenceResponse200>> {
    return this.core.fetch('/v3/bvn/verifications/{reference}', 'get', metadata);
  }

  /**
   * Get all Settlements
   *
   */
  getV3Settlements(metadata?: types.GetV3SettlementsMetadataParam): Promise<FetchResponse<200, types.GetV3SettlementsResponse200>> {
    return this.core.fetch('/v3/settlements', 'get', metadata);
  }

  /**
   * Get a Settlement
   *
   * @throws FetchError<400, types.GetV3SettlementsIdResponse400> Sample Error Response
   */
  getV3SettlementsId(metadata: types.GetV3SettlementsIdMetadataParam): Promise<FetchResponse<200, types.GetV3SettlementsIdResponse200>> {
    return this.core.fetch('/v3/settlements/{id}', 'get', metadata);
  }

  /**
   * Create an OTP
   *
   * @throws FetchError<400, types.PostV3OtpsResponse400> Sample Error Response
   */
  postV3Otps(metadata?: types.PostV3OtpsMetadataParam): Promise<FetchResponse<200, types.PostV3OtpsResponse200>> {
    return this.core.fetch('/v3/otps', 'post', metadata);
  }

  /**
   * Validate an OTP
   *
   * @throws FetchError<400, types.PostV3OtpsReferenceValidateResponse400> Sample Error Response
   */
  postV3OtpsReferenceValidate(body: types.PostV3OtpsReferenceValidateBodyParam, metadata: types.PostV3OtpsReferenceValidateMetadataParam): Promise<FetchResponse<200, types.PostV3OtpsReferenceValidateResponse200>>;
  postV3OtpsReferenceValidate(metadata: types.PostV3OtpsReferenceValidateMetadataParam): Promise<FetchResponse<200, types.PostV3OtpsReferenceValidateResponse200>>;
  postV3OtpsReferenceValidate(body?: types.PostV3OtpsReferenceValidateBodyParam | types.PostV3OtpsReferenceValidateMetadataParam, metadata?: types.PostV3OtpsReferenceValidateMetadataParam): Promise<FetchResponse<200, types.PostV3OtpsReferenceValidateResponse200>> {
    return this.core.fetch('/v3/otps/{reference}/validate', 'post', body, metadata);
  }

  /**
   * Get all Chargebacks
   *
   */
  getV3Chargebacks(metadata?: types.GetV3ChargebacksMetadataParam): Promise<FetchResponse<200, types.GetV3ChargebacksResponse200>> {
    return this.core.fetch('/v3/chargebacks', 'get', metadata);
  }

  /**
   * Accept/Decline Chargebacks
   *
   * @throws FetchError<400, types.PutV3ChargebacksIdResponse400> Sample Error Response
   */
  putV3ChargebacksId(body: types.PutV3ChargebacksIdBodyParam, metadata: types.PutV3ChargebacksIdMetadataParam): Promise<FetchResponse<200, types.PutV3ChargebacksIdResponse200>>;
  putV3ChargebacksId(metadata: types.PutV3ChargebacksIdMetadataParam): Promise<FetchResponse<200, types.PutV3ChargebacksIdResponse200>>;
  putV3ChargebacksId(body?: types.PutV3ChargebacksIdBodyParam | types.PutV3ChargebacksIdMetadataParam, metadata?: types.PutV3ChargebacksIdMetadataParam): Promise<FetchResponse<200, types.PutV3ChargebacksIdResponse200>> {
    return this.core.fetch('/v3/chargebacks/{id}', 'put', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteV3BeneficiariesIdMetadataParam, DeleteV3BeneficiariesIdResponse200, DeleteV3BeneficiariesIdResponse400, DeleteV3SubaccountsIdMetadataParam, DeleteV3SubaccountsIdResponse200, DeleteV3SubaccountsIdResponse400, GetV3BalancesCurrencyMetadataParam, GetV3BalancesCurrencyResponse200, GetV3BalancesMetadataParam, GetV3BalancesResponse200, GetV3BanksCountryMetadataParam, GetV3BanksCountryResponse200, GetV3BanksCountryResponse404, GetV3BanksIdBranchesMetadataParam, GetV3BanksIdBranchesResponse200, GetV3BanksIdBranchesResponse404, GetV3BeneficiariesIdMetadataParam, GetV3BeneficiariesIdResponse200, GetV3BeneficiariesResponse200, GetV3BillItemsCb141ValidateMetadataParam, GetV3BillItemsCb141ValidateResponse200, GetV3BillItemsCb141ValidateResponse400, GetV3BillersBillerCodeItemsMetadataParam, GetV3BillersBillerCodeItemsResponse200, GetV3BillersBillerCodeItemsResponse400, GetV3BillsCategoryBillersMetadataParam, GetV3BillsCategoryBillersResponse200, GetV3BillsCategoryBillersResponse400, GetV3BillsHistoryMetadataParam, GetV3BillsHistoryResponse200, GetV3BillsReferenceMetadataParam, GetV3BillsReferenceResponse200, GetV3BillsReferenceResponse400, GetV3BillsSummaryMetadataParam, GetV3BillsSummaryResponse200, GetV3BulkTokenizedChargesBulkIdMetadataParam, GetV3BulkTokenizedChargesBulkIdResponse200, GetV3BulkTokenizedChargesBulkIdResponse400, GetV3BulkTokenizedChargesBulkIdTransactionsMetadataParam, GetV3BulkTokenizedChargesBulkIdTransactionsResponse200, GetV3BulkTokenizedChargesBulkIdTransactionsResponse400, GetV3BulkVirtualAccountNumbersBatchIdMetadataParam, GetV3BulkVirtualAccountNumbersBatchIdResponse200, GetV3BulkVirtualAccountNumbersBatchIdResponse400, GetV3BvnVerificationsReferenceMetadataParam, GetV3BvnVerificationsReferenceResponse200, GetV3BvnVerificationsReferenceResponse400, GetV3CardBinsBinMetadataParam, GetV3CardBinsBinResponse200, GetV3CardBinsBinResponse400, GetV3ChargebacksMetadataParam, GetV3ChargebacksResponse200, GetV3PaymentPlansIdMetadataParam, GetV3PaymentPlansIdResponse200, GetV3PaymentPlansMetadataParam, GetV3PaymentPlansResponse200, GetV3PayoutSubaccountsAccountReferenceBalancesMetadataParam, GetV3PayoutSubaccountsAccountReferenceBalancesResponse200, GetV3PayoutSubaccountsAccountReferenceBalancesResponse400, GetV3PayoutSubaccountsAccountReferenceMetadataParam, GetV3PayoutSubaccountsAccountReferenceResponse200, GetV3PayoutSubaccountsAccountReferenceResponse400, GetV3PayoutSubaccountsAccountReferenceStaticAccountMetadataParam, GetV3PayoutSubaccountsAccountReferenceStaticAccountResponse200, GetV3PayoutSubaccountsAccountReferenceStaticAccountResponse400, GetV3PayoutSubaccountsAccountReferenceTransactionsMetadataParam, GetV3PayoutSubaccountsAccountReferenceTransactionsResponse200, GetV3PayoutSubaccountsAccountReferenceTransactionsResponse400, GetV3PayoutSubaccountsMetadataParam, GetV3PayoutSubaccountsResponse200, GetV3RefundsResponse200, GetV3SettlementsIdMetadataParam, GetV3SettlementsIdResponse200, GetV3SettlementsIdResponse400, GetV3SettlementsMetadataParam, GetV3SettlementsResponse200, GetV3SubaccountsIdMetadataParam, GetV3SubaccountsIdResponse200, GetV3SubaccountsIdResponse400, GetV3SubaccountsMetadataParam, GetV3SubaccountsResponse200, GetV3SubscriptionsMetadataParam, GetV3SubscriptionsResponse200, GetV3TopBillCategoriesMetadataParam, GetV3TopBillCategoriesResponse200, GetV3TopBillCategoriesResponse400, GetV3TransactionsFeeMetadataParam, GetV3TransactionsFeeResponse200, GetV3TransactionsFeeResponse400, GetV3TransactionsIdEventsMetadataParam, GetV3TransactionsIdEventsResponse200, GetV3TransactionsIdVerifyMetadataParam, GetV3TransactionsIdVerifyResponse200, GetV3TransactionsIdVerifyResponse400, GetV3TransactionsMetadataParam, GetV3TransactionsResponse200, GetV3TransactionsVerifyByReferenceMetadataParam, GetV3TransactionsVerifyByReferenceResponse200, GetV3TransactionsVerifyByReferenceResponse400, GetV3TransfersFeeMetadataParam, GetV3TransfersFeeResponse200, GetV3TransfersFeeResponse400, GetV3TransfersIdBodyParam, GetV3TransfersIdMetadataParam, GetV3TransfersIdResponse200, GetV3TransfersIdResponse404, GetV3TransfersIdRetriesMetadataParam, GetV3TransfersIdRetriesResponse200, GetV3TransfersMetadataParam, GetV3TransfersRatesBodyParam, GetV3TransfersRatesMetadataParam, GetV3TransfersRatesResponse200, GetV3VirtualAccountNumbersOrderRefMetadataParam, GetV3VirtualAccountNumbersOrderRefResponse200, GetV3VirtualAccountNumbersOrderRefResponse400, GetV3VirtualCardsIdMetadataParam, GetV3VirtualCardsIdResponse200, GetV3VirtualCardsIdTransactionsMetadataParam, GetV3VirtualCardsIdTransactionsResponse200, GetV3VirtualCardsMetadataParam, GetV3VirtualCardsResponse200, GetV3WalletStatementMetadataParam, GetV3WalletStatementResponse200, PostV3AccountsResolveMetadataParam, PostV3AccountsResolveResponse200, PostV3AccountsResolveResponse400, PostV3BeneficiariesMetadataParam, PostV3BeneficiariesResponse200, PostV3BeneficiariesResponse400, PostV3BillersBillerCodeItemsItemCodePaymentMetadataParam, PostV3BillersBillerCodeItemsItemCodePaymentResponse200, PostV3BillersBillerCodeItemsItemCodePaymentResponse400, PostV3BulkBillsMetadataParam, PostV3BulkBillsResponse200, PostV3BulkBillsResponse400, PostV3BulkTokenizedChargesBodyParam, PostV3BulkTokenizedChargesResponse200, PostV3BulkTokenizedChargesResponse400, PostV3BulkTransfersMetadataParam, PostV3BulkTransfersResponse200, PostV3BulkTransfersResponse400, PostV3BulkVirtualAccountNumbersMetadataParam, PostV3BulkVirtualAccountNumbersResponse200, PostV3BulkVirtualAccountNumbersResponse400, PostV3BvnVerificationsBodyParam, PostV3BvnVerificationsResponse200, PostV3BvnVerificationsResponse400, PostV3ChargesBodyParam, PostV3ChargesFlwRefCaptureBodyParam, PostV3ChargesFlwRefCaptureMetadataParam, PostV3ChargesFlwRefCaptureResponse200, PostV3ChargesFlwRefCaptureResponse400, PostV3ChargesFlwRefRefundBodyParam, PostV3ChargesFlwRefRefundMetadataParam, PostV3ChargesFlwRefRefundResponse200, PostV3ChargesFlwRefRefundResponse400, PostV3ChargesFlwRefVoidMetadataParam, PostV3ChargesFlwRefVoidResponse200, PostV3ChargesFlwRefVoidResponse400, PostV3ChargesMetadataParam, PostV3ChargesResponse200, PostV3ChargesResponse400, PostV3OtpsMetadataParam, PostV3OtpsReferenceValidateBodyParam, PostV3OtpsReferenceValidateMetadataParam, PostV3OtpsReferenceValidateResponse200, PostV3OtpsReferenceValidateResponse400, PostV3OtpsResponse200, PostV3OtpsResponse400, PostV3PaymentPlansMetadataParam, PostV3PaymentPlansResponse200, PostV3PayoutSubaccountsMetadataParam, PostV3PayoutSubaccountsResponse200, PostV3PayoutSubaccountsResponse400, PostV3SubaccountsMetadataParam, PostV3SubaccountsResponse200, PostV3SubaccountsResponse400, PostV3TokenizedChargesMetadataParam, PostV3TokenizedChargesResponse200, PostV3TokenizedChargesResponse400, PostV3TransactionsIdRefundMetadataParam, PostV3TransactionsIdRefundResponse200, PostV3TransactionsIdResendHookMetadataParam, PostV3TransactionsIdResendHookResponse200, PostV3TransactionsIdResendHookResponse400, PostV3TransfersIdRetriesMetadataParam, PostV3TransfersIdRetriesResponse200, PostV3TransfersIdRetriesResponse400, PostV3TransfersMetadataParam, PostV3TransfersResponse200, PostV3TransfersResponse400, PostV3ValidateChargeMetadataParam, PostV3ValidateChargeResponse200, PostV3ValidateChargeResponse400, PostV3VirtualAccountNumbersMetadataParam, PostV3VirtualAccountNumbersOrderRefBodyParam, PostV3VirtualAccountNumbersOrderRefMetadataParam, PostV3VirtualAccountNumbersResponse200, PostV3VirtualAccountNumbersResponse400, PostV3VirtualCardsIdFundMetadataParam, PostV3VirtualCardsIdFundResponse200, PostV3VirtualCardsIdWithdrawMetadataParam, PostV3VirtualCardsIdWithdrawResponse200, PostV3VirtualCardsMetadataParam, PostV3VirtualCardsResponse200, PutV3ChargebacksIdBodyParam, PutV3ChargebacksIdMetadataParam, PutV3ChargebacksIdResponse200, PutV3ChargebacksIdResponse400, PutV3PaymentPlansIdCancelMetadataParam, PutV3PaymentPlansIdCancelResponse200, PutV3PaymentPlansIdCancelResponse400, PutV3PaymentPlansIdMetadataParam, PutV3PaymentPlansIdResponse200, PutV3PaymentPlansIdResponse400, PutV3PayoutSubaccountsAccountReferenceMetadataParam, PutV3PayoutSubaccountsAccountReferenceResponse200, PutV3PayoutSubaccountsAccountReferenceResponse400, PutV3SubaccountsIdMetadataParam, PutV3SubaccountsIdResponse200, PutV3SubaccountsIdResponse400, PutV3SubscriptionsIdActivateMetadataParam, PutV3SubscriptionsIdActivateResponse200, PutV3SubscriptionsIdActivateResponse400, PutV3SubscriptionsIdCancelMetadataParam, PutV3SubscriptionsIdCancelResponse200, PutV3SubscriptionsIdCancelResponse400, PutV3TokensTokenMetadataParam, PutV3TokensTokenResponse200, PutV3TokensTokenResponse400, PutV3VirtualAccountNumbersOrderRefMetadataParam, PutV3VirtualCardsIdStatusStatusActionMetadataParam, PutV3VirtualCardsIdStatusStatusActionResponse200, PutV3VirtualCardsIdTerminateMetadataParam, PutV3VirtualCardsIdTerminateResponse200 } from './types';
