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
    this.core = new APICore(this.spec, 'xpress-wallet/1.0.0 (api/6.1.3)');
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
   * Login
   *
   */
  postAuthLogin(body?: types.PostAuthLoginBodyParam): Promise<FetchResponse<200, types.PostAuthLoginResponse200>> {
    return this.core.fetch('/auth/login', 'post', body);
  }

  /**
   * Logout
   *
   */
  postAuthLogout(metadata?: types.PostAuthLogoutMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/auth/logout', 'post', metadata);
  }

  /**
   * Forget Password
   *
   */
  postAuthPasswordForget(body?: types.PostAuthPasswordForgetBodyParam, metadata?: types.PostAuthPasswordForgetMetadataParam): Promise<FetchResponse<200, types.PostAuthPasswordForgetResponse200>> {
    return this.core.fetch('/auth/password/forget', 'post', body, metadata);
  }

  /**
   * Reset Password
   *
   */
  postAuthPasswordReset(body?: types.PostAuthPasswordResetBodyParam): Promise<FetchResponse<200, types.PostAuthPasswordResetResponse200>> {
    return this.core.fetch('/auth/password/reset', 'post', body);
  }

  /**
   * Refresh Tokens
   *
   * @throws FetchError<400, types.PostAuthRefreshTokenResponse400> Refresh Tokens - invalid token
   */
  postAuthRefreshToken(body?: types.PostAuthRefreshTokenBodyParam, metadata?: types.PostAuthRefreshTokenMetadataParam): Promise<FetchResponse<200, types.PostAuthRefreshTokenResponse200>> {
    return this.core.fetch('/auth/refresh/token', 'post', body, metadata);
  }

  /**
   * My Profile
   *
   */
  getUserProfile(metadata?: types.GetUserProfileMetadataParam): Promise<FetchResponse<200, types.GetUserProfileResponse200>> {
    return this.core.fetch('/user/profile', 'get', metadata);
  }

  /**
   * Change Password
   *
   */
  putUserPassword(body?: types.PutUserPasswordBodyParam, metadata?: types.PutUserPasswordMetadataParam): Promise<FetchResponse<200, types.PutUserPasswordResponse200>> {
    return this.core.fetch('/user/password', 'put', body, metadata);
  }

  /**
   * All Customers
   *
   */
  getCustomer(metadata?: types.GetCustomerMetadataParam): Promise<FetchResponse<200, types.GetCustomerResponse200>> {
    return this.core.fetch('/customer', 'get', metadata);
  }

  /**
   * Customer Details
   *
   */
  getCustomerCustomerid(body: types.GetCustomerCustomeridBodyParam, metadata: types.GetCustomerCustomeridMetadataParam): Promise<FetchResponse<200, types.GetCustomerCustomeridResponse200>>;
  getCustomerCustomerid(metadata: types.GetCustomerCustomeridMetadataParam): Promise<FetchResponse<200, types.GetCustomerCustomeridResponse200>>;
  getCustomerCustomerid(body?: types.GetCustomerCustomeridBodyParam | types.GetCustomerCustomeridMetadataParam, metadata?: types.GetCustomerCustomeridMetadataParam): Promise<FetchResponse<200, types.GetCustomerCustomeridResponse200>> {
    return this.core.fetch('/customer/{customerId}', 'get', body, metadata);
  }

  /**
   * Find By Phone Number
   *
   */
  getCustomerPhone(metadata?: types.GetCustomerPhoneMetadataParam): Promise<FetchResponse<200, types.GetCustomerPhoneResponse200>> {
    return this.core.fetch('/customer/phone', 'get', metadata);
  }

  /**
   * Update Customer Profile
   *
   */
  putCustomer6834b937Bdf0430e960090009cd5c92e(body?: types.PutCustomer6834B937Bdf0430E960090009Cd5C92EBodyParam, metadata?: types.PutCustomer6834B937Bdf0430E960090009Cd5C92EMetadataParam): Promise<FetchResponse<200, types.PutCustomer6834B937Bdf0430E960090009Cd5C92EResponse200>> {
    return this.core.fetch('/customer/6834b937-bdf0-430e-9600-90009cd5c92e', 'put', body, metadata);
  }

  /**
   * Create Customer Wallet
   *
   */
  postWallet(body?: types.PostWalletBodyParam, metadata?: types.PostWalletMetadataParam): Promise<FetchResponse<200, types.PostWalletResponse200>> {
    return this.core.fetch('/wallet', 'post', body, metadata);
  }

  /**
   * All Wallets
   *
   */
  getWallet(metadata?: types.GetWalletMetadataParam): Promise<FetchResponse<200, types.GetWalletResponse200>> {
    return this.core.fetch('/wallet', 'get', metadata);
  }

  /**
   * Customer Wallet
   *
   */
  getWalletCustomer(metadata?: types.GetWalletCustomerMetadataParam): Promise<FetchResponse<200, types.GetWalletCustomerResponse200>> {
    return this.core.fetch('/wallet/customer', 'get', metadata);
  }

  /**
   * Credit Wallet
   *
   */
  postWalletCredit(body?: types.PostWalletCreditBodyParam, metadata?: types.PostWalletCreditMetadataParam): Promise<FetchResponse<200, types.PostWalletCreditResponse200>> {
    return this.core.fetch('/wallet/credit', 'post', body, metadata);
  }

  /**
   * Debit Wallet
   *
   */
  postWalletDebit(body?: types.PostWalletDebitBodyParam, metadata?: types.PostWalletDebitMetadataParam): Promise<FetchResponse<200, types.PostWalletDebitResponse200>> {
    return this.core.fetch('/wallet/debit', 'post', body, metadata);
  }

  /**
   * Freeze Customer Wallet
   *
   */
  postWalletClose(body?: types.PostWalletCloseBodyParam, metadata?: types.PostWalletCloseMetadataParam): Promise<FetchResponse<200, types.PostWalletCloseResponse200>> {
    return this.core.fetch('/wallet/close', 'post', body, metadata);
  }

  /**
   * Unfreeze Customer Wallet
   *
   */
  postWalletEnable(body?: types.PostWalletEnableBodyParam, metadata?: types.PostWalletEnableMetadataParam): Promise<FetchResponse<200, types.PostWalletEnableResponse200>> {
    return this.core.fetch('/wallet/enable', 'post', body, metadata);
  }

  /**
   * Batch Credit Customer Wallets
   *
   */
  postWalletBatchCreditCustomerWallet(body?: types.PostWalletBatchCreditCustomerWalletBodyParam, metadata?: types.PostWalletBatchCreditCustomerWalletMetadataParam): Promise<FetchResponse<200, types.PostWalletBatchCreditCustomerWalletResponse200>> {
    return this.core.fetch('/wallet/batch-credit-customer-wallet', 'post', body, metadata);
  }

  /**
   * Batch Debit Customer Wallets
   *
   */
  postWalletBatchDebitCustomerWallet(body?: types.PostWalletBatchDebitCustomerWalletBodyParam, metadata?: types.PostWalletBatchDebitCustomerWalletMetadataParam): Promise<FetchResponse<200, types.PostWalletBatchDebitCustomerWalletResponse200>> {
    return this.core.fetch('/wallet/batch-debit-customer-wallet', 'post', body, metadata);
  }

  /**
   * Customer Batch Credit Customer Wallets
   *
   */
  postWalletCustomerBatchCreditCustomerWallet(body?: types.PostWalletCustomerBatchCreditCustomerWalletBodyParam, metadata?: types.PostWalletCustomerBatchCreditCustomerWalletMetadataParam): Promise<FetchResponse<200, types.PostWalletCustomerBatchCreditCustomerWalletResponse200>> {
    return this.core.fetch('/wallet/customer-batch-credit-customer-wallet', 'post', body, metadata);
  }

  /**
   * Fund Merchant Sandbox Wallet
   *
   */
  postMerchantFundWallet(body?: types.PostMerchantFundWalletBodyParam, metadata?: types.PostMerchantFundWalletMetadataParam): Promise<FetchResponse<200, types.PostMerchantFundWalletResponse200>> {
    return this.core.fetch('/merchant/fund-wallet', 'post', body, metadata);
  }

  /**
   * Merchant Transactions
   *
   */
  getMerchantTransactions(metadata?: types.GetMerchantTransactionsMetadataParam): Promise<FetchResponse<200, types.GetMerchantTransactionsResponse200>> {
    return this.core.fetch('/merchant/transactions', 'get', metadata);
  }

  /**
   * Transaction Details
   *
   */
  getMerchantTransactionTransactionreference(metadata: types.GetMerchantTransactionTransactionreferenceMetadataParam): Promise<FetchResponse<200, types.GetMerchantTransactionTransactionreferenceResponse200>> {
    return this.core.fetch('/merchant/transaction/{transactionReference}', 'get', metadata);
  }

  /**
   * Customer Transactions
   *
   */
  getTransactionCustomer(metadata?: types.GetTransactionCustomerMetadataParam): Promise<FetchResponse<200, types.GetTransactionCustomerResponse200>> {
    return this.core.fetch('/transaction/customer', 'get', metadata);
  }

  /**
   * Batch Transactions
   *
   */
  getTransactionBatch(metadata?: types.GetTransactionBatchMetadataParam): Promise<FetchResponse<200, types.GetTransactionBatchResponse200>> {
    return this.core.fetch('/transaction/batch', 'get', metadata);
  }

  /**
   * Batch Transaction Details
   *
   */
  getTransactionBatchReference(metadata: types.GetTransactionBatchReferenceMetadataParam): Promise<FetchResponse<200, types.GetTransactionBatchReferenceResponse200>> {
    return this.core.fetch('/transaction/batch/{reference}', 'get', metadata);
  }

  /**
   * Reverse Batch Transaction
   *
   * @throws FetchError<400, types.PostWalletReverseBatchTransactionResponse400> Reverse Batch Transaction - No Record
   */
  postWalletReverseBatchTransaction(body?: types.PostWalletReverseBatchTransactionBodyParam, metadata?: types.PostWalletReverseBatchTransactionMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/wallet/reverse-batch-transaction', 'post', body, metadata);
  }

  /**
   * Pending Transactions
   *
   */
  getTransactionPending(metadata?: types.GetTransactionPendingMetadataParam): Promise<FetchResponse<200, types.GetTransactionPendingResponse200>> {
    return this.core.fetch('/transaction/pending', 'get', metadata);
  }

  /**
   * Approve Transaction
   *
   */
  postTransactionApprove(body?: types.PostTransactionApproveBodyParam, metadata?: types.PostTransactionApproveMetadataParam): Promise<FetchResponse<200, types.PostTransactionApproveResponse200>> {
    return this.core.fetch('/transaction/approve', 'post', body, metadata);
  }

  /**
   * Decline Pending Transaction
   *
   */
  deleteTransactionTransactionid(body: types.DeleteTransactionTransactionidBodyParam, metadata: types.DeleteTransactionTransactionidMetadataParam): Promise<FetchResponse<200, types.DeleteTransactionTransactionidResponse200>>;
  deleteTransactionTransactionid(metadata: types.DeleteTransactionTransactionidMetadataParam): Promise<FetchResponse<200, types.DeleteTransactionTransactionidResponse200>>;
  deleteTransactionTransactionid(body?: types.DeleteTransactionTransactionidBodyParam | types.DeleteTransactionTransactionidMetadataParam, metadata?: types.DeleteTransactionTransactionidMetadataParam): Promise<FetchResponse<200, types.DeleteTransactionTransactionidResponse200>> {
    return this.core.fetch('/transaction/{transactionId}', 'delete', body, metadata);
  }

  /**
   * Download Merchant Transactions
   *
   */
  getTransactionDownloadMerchant(metadata?: types.GetTransactionDownloadMerchantMetadataParam): Promise<FetchResponse<200, types.GetTransactionDownloadMerchantResponse200>> {
    return this.core.fetch('/transaction/download/merchant', 'get', metadata);
  }

  /**
   * Download Customer Transactions
   *
   */
  getTransactionDownloadCustomer(metadata?: types.GetTransactionDownloadCustomerMetadataParam): Promise<FetchResponse<200, types.GetTransactionDownloadCustomerResponse200>> {
    return this.core.fetch('/transaction/download/customer', 'get', metadata);
  }

  /**
   * Bank List
   *
   */
  getTransferBanks(metadata?: types.GetTransferBanksMetadataParam): Promise<FetchResponse<200, types.GetTransferBanksResponse200>> {
    return this.core.fetch('/transfer/banks', 'get', metadata);
  }

  /**
   * Get Bank Account Details
   *
   */
  getTransferAccountDetails(metadata?: types.GetTransferAccountDetailsMetadataParam): Promise<FetchResponse<200, types.GetTransferAccountDetailsResponse200>> {
    return this.core.fetch('/transfer/account/details', 'get', metadata);
  }

  /**
   * Merchant Bank Transfer
   *
   */
  postTransferBank(body?: types.PostTransferBankBodyParam, metadata?: types.PostTransferBankMetadataParam): Promise<FetchResponse<200, types.PostTransferBankResponse200>> {
    return this.core.fetch('/transfer/bank', 'post', body, metadata);
  }

  /**
   * Customer Bank Transfer
   *
   */
  postTransferBankCustomer(body?: types.PostTransferBankCustomerBodyParam, metadata?: types.PostTransferBankCustomerMetadataParam): Promise<FetchResponse<200, types.PostTransferBankCustomerResponse200>> {
    return this.core.fetch('/transfer/bank/customer', 'post', body, metadata);
  }

  /**
   * Merchant Batch Bank Transfer
   *
   */
  postTransferBankBatch(body?: types.PostTransferBankBatchBodyParam, metadata?: types.PostTransferBankBatchMetadataParam): Promise<FetchResponse<200, types.PostTransferBankBatchResponse200>> {
    return this.core.fetch('/transfer/bank/batch', 'post', body, metadata);
  }

  /**
   * Customer to Customer Wallet Transfer
   *
   */
  postTransferWallet(body?: types.PostTransferWalletBodyParam, metadata?: types.PostTransferWalletMetadataParam): Promise<FetchResponse<200, types.PostTransferWalletResponse200>> {
    return this.core.fetch('/transfer/wallet', 'post', body, metadata);
  }

  /**
   * Card Setup
   *
   */
  putCardSetup(body?: types.PutCardSetupBodyParam, metadata?: types.PutCardSetupMetadataParam): Promise<FetchResponse<200, types.PutCardSetupResponse200>> {
    return this.core.fetch('/card/setup', 'put', body, metadata);
  }

  /**
   * Create Card
   *
   */
  postCard(body?: types.PostCardBodyParam, metadata?: types.PostCardMetadataParam): Promise<FetchResponse<200, types.PostCardResponse200>> {
    return this.core.fetch('/card', 'post', body, metadata);
  }

  /**
   * Activate Card
   *
   */
  postCardActivate(body?: types.PostCardActivateBodyParam, metadata?: types.PostCardActivateMetadataParam): Promise<FetchResponse<200, types.PostCardActivateResponse200>> {
    return this.core.fetch('/card/activate', 'post', body, metadata);
  }

  /**
   * Balance
   *
   */
  getCardBalance(metadata?: types.GetCardBalanceMetadataParam): Promise<FetchResponse<200, types.GetCardBalanceResponse200>> {
    return this.core.fetch('/card/balance', 'get', metadata);
  }

  /**
   * Fund Card
   *
   */
  postCardFund(body?: types.PostCardFundBodyParam, metadata?: types.PostCardFundMetadataParam): Promise<FetchResponse<200, types.PostCardFundResponse200>> {
    return this.core.fetch('/card/fund', 'post', body, metadata);
  }

  /**
   * Invite team member
   *
   */
  postTeamInvitations(body?: types.PostTeamInvitationsBodyParam, metadata?: types.PostTeamInvitationsMetadataParam): Promise<FetchResponse<200, types.PostTeamInvitationsResponse200>> {
    return this.core.fetch('/team/invitations', 'post', body, metadata);
  }

  /**
   * All invitations
   *
   */
  getTeamInvitations(metadata?: types.GetTeamInvitationsMetadataParam): Promise<FetchResponse<200, types.GetTeamInvitationsResponse200>> {
    return this.core.fetch('/team/invitations', 'get', metadata);
  }

  /**
   * Team Members
   *
   */
  getTeamMembers(metadata?: types.GetTeamMembersMetadataParam): Promise<FetchResponse<200, types.GetTeamMembersResponse200>> {
    return this.core.fetch('/team/members', 'get', metadata);
  }

  /**
   * Resend invitation
   *
   */
  postTeamInvitationsResend(body?: types.PostTeamInvitationsResendBodyParam, metadata?: types.PostTeamInvitationsResendMetadataParam): Promise<FetchResponse<200, types.PostTeamInvitationsResendResponse200>> {
    return this.core.fetch('/team/invitations/resend', 'post', body, metadata);
  }

  /**
   * Accept invitation
   *
   * @throws FetchError<400, types.PostTeamInvitationsAcceptResponse400> Accept invitation - Already accepted
   */
  postTeamInvitationsAccept(body?: types.PostTeamInvitationsAcceptBodyParam, metadata?: types.PostTeamInvitationsAcceptMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/team/invitations/accept', 'post', body, metadata);
  }

  /**
   * Merchant List
   *
   */
  getTeamMerchants(metadata?: types.GetTeamMerchantsMetadataParam): Promise<FetchResponse<200, types.GetTeamMerchantsResponse200>> {
    return this.core.fetch('/team/merchants', 'get', metadata);
  }

  /**
   * Switch Merchant
   *
   */
  postTeamMerchantsSwitch(body?: types.PostTeamMerchantsSwitchBodyParam, metadata?: types.PostTeamMerchantsSwitchMetadataParam): Promise<FetchResponse<200, types.PostTeamMerchantsSwitchResponse200>> {
    return this.core.fetch('/team/merchants/switch', 'post', body, metadata);
  }

  /**
   * Update Member Information
   *
   */
  putTeamMember0b9bce55Fb6a4249A08b5fb6802febac(body?: types.PutTeamMember0B9Bce55Fb6A4249A08B5Fb6802FebacBodyParam, metadata?: types.PutTeamMember0B9Bce55Fb6A4249A08B5Fb6802FebacMetadataParam): Promise<FetchResponse<200, types.PutTeamMember0B9Bce55Fb6A4249A08B5Fb6802FebacResponse200>> {
    return this.core.fetch('/team/member/0b9bce55-fb6a-4249-a08b-5fb6802febac', 'put', body, metadata);
  }

  /**
   * All Permissions
   *
   */
  getTeamPermissions(body?: types.GetTeamPermissionsBodyParam, metadata?: types.GetTeamPermissionsMetadataParam): Promise<FetchResponse<200, types.GetTeamPermissionsResponse200>> {
    return this.core.fetch('/team/permissions', 'get', body, metadata);
  }

  /**
   * All roles
   *
   */
  getTeamRoles(metadata?: types.GetTeamRolesMetadataParam): Promise<FetchResponse<200, types.GetTeamRolesResponse200>> {
    return this.core.fetch('/team/roles', 'get', metadata);
  }

  /**
   * Create Role
   *
   */
  postTeamRoles(body?: types.PostTeamRolesBodyParam, metadata?: types.PostTeamRolesMetadataParam): Promise<FetchResponse<200, types.PostTeamRolesResponse200>> {
    return this.core.fetch('/team/roles', 'post', body, metadata);
  }

  /**
   * Update Role
   *
   * @throws FetchError<400, types.PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9Response400> Update Role - Failed
   */
  patchTeamRoles36fb6cdcC10745509a2b2c23ec8a78b9(body?: types.PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9BodyParam, metadata?: types.PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9MetadataParam): Promise<FetchResponse<200, types.PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9Response200>> {
    return this.core.fetch('/team/roles/36fb6cdc-c107-4550-9a2b-2c23ec8a78b9', 'patch', body, metadata);
  }

  /**
   * Account Verification
   *
   */
  putMerchantVerify(body?: types.PutMerchantVerifyBodyParam): Promise<FetchResponse<200, types.PutMerchantVerifyResponse200>> {
    return this.core.fetch('/merchant/verify', 'put', body);
  }

  /**
   * Resend Verification Code
   *
   */
  postMerchantVerifyResend(body?: types.PostMerchantVerifyResendBodyParam, metadata?: types.PostMerchantVerifyResendMetadataParam): Promise<FetchResponse<200, types.PostMerchantVerifyResendResponse200>> {
    return this.core.fetch('/merchant/verify/resend', 'post', body, metadata);
  }

  /**
   * Merchant KYC
   *
   */
  putMerchantCompleteMerchantRegistration(): Promise<FetchResponse<200, types.PutMerchantCompleteMerchantRegistrationResponse200>> {
    return this.core.fetch('/merchant/complete-merchant-registration', 'put');
  }

  /**
   * Merchant Profile
   *
   */
  getMerchantProfile(body?: types.GetMerchantProfileBodyParam, metadata?: types.GetMerchantProfileMetadataParam): Promise<FetchResponse<200, types.GetMerchantProfileResponse200>> {
    return this.core.fetch('/merchant/profile', 'get', body, metadata);
  }

  /**
   * Update Merchant Profile
   *
   */
  patchMerchantProfile(body?: types.PatchMerchantProfileBodyParam, metadata?: types.PatchMerchantProfileMetadataParam): Promise<FetchResponse<200, types.PatchMerchantProfileResponse200>> {
    return this.core.fetch('/merchant/profile', 'patch', body, metadata);
  }

  /**
   * Merchant Access Keys
   *
   */
  getMerchantMyAccessKeys(metadata?: types.GetMerchantMyAccessKeysMetadataParam): Promise<FetchResponse<200, types.GetMerchantMyAccessKeysResponse200>> {
    return this.core.fetch('/merchant/my-access-keys', 'get', metadata);
  }

  /**
   * Generate Access Keys
   *
   */
  postMerchantGenerateAccessKeys(metadata?: types.PostMerchantGenerateAccessKeysMetadataParam): Promise<FetchResponse<200, types.PostMerchantGenerateAccessKeysResponse200>> {
    return this.core.fetch('/merchant/generate-access-keys', 'post', metadata);
  }

  /**
   * Switch Account Mode
   *
   * @throws FetchError<400, types.PostMerchantAccountModeResponse400> Switch Account Mode - Fails
   */
  postMerchantAccountMode(body?: types.PostMerchantAccountModeBodyParam, metadata?: types.PostMerchantAccountModeMetadataParam): Promise<FetchResponse<200, types.PostMerchantAccountModeResponse200>> {
    return this.core.fetch('/merchant/account-mode', 'post', body, metadata);
  }

  /**
   * Merchant Registration
   *
   */
  postMerchant(body?: types.PostMerchantBodyParam): Promise<FetchResponse<201, types.PostMerchantResponse201>> {
    return this.core.fetch('/merchant', 'post', body);
  }

  /**
   * Merchant Wallet
   *
   */
  getMerchantWallet(metadata?: types.GetMerchantWalletMetadataParam): Promise<FetchResponse<200, types.GetMerchantWalletResponse200>> {
    return this.core.fetch('/merchant/wallet', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteTransactionTransactionidBodyParam, DeleteTransactionTransactionidMetadataParam, DeleteTransactionTransactionidResponse200, GetCardBalanceMetadataParam, GetCardBalanceResponse200, GetCustomerCustomeridBodyParam, GetCustomerCustomeridMetadataParam, GetCustomerCustomeridResponse200, GetCustomerMetadataParam, GetCustomerPhoneMetadataParam, GetCustomerPhoneResponse200, GetCustomerResponse200, GetMerchantMyAccessKeysMetadataParam, GetMerchantMyAccessKeysResponse200, GetMerchantProfileBodyParam, GetMerchantProfileMetadataParam, GetMerchantProfileResponse200, GetMerchantTransactionTransactionreferenceMetadataParam, GetMerchantTransactionTransactionreferenceResponse200, GetMerchantTransactionsMetadataParam, GetMerchantTransactionsResponse200, GetMerchantWalletMetadataParam, GetMerchantWalletResponse200, GetTeamInvitationsMetadataParam, GetTeamInvitationsResponse200, GetTeamMembersMetadataParam, GetTeamMembersResponse200, GetTeamMerchantsMetadataParam, GetTeamMerchantsResponse200, GetTeamPermissionsBodyParam, GetTeamPermissionsMetadataParam, GetTeamPermissionsResponse200, GetTeamRolesMetadataParam, GetTeamRolesResponse200, GetTransactionBatchMetadataParam, GetTransactionBatchReferenceMetadataParam, GetTransactionBatchReferenceResponse200, GetTransactionBatchResponse200, GetTransactionCustomerMetadataParam, GetTransactionCustomerResponse200, GetTransactionDownloadCustomerMetadataParam, GetTransactionDownloadCustomerResponse200, GetTransactionDownloadMerchantMetadataParam, GetTransactionDownloadMerchantResponse200, GetTransactionPendingMetadataParam, GetTransactionPendingResponse200, GetTransferAccountDetailsMetadataParam, GetTransferAccountDetailsResponse200, GetTransferBanksMetadataParam, GetTransferBanksResponse200, GetUserProfileMetadataParam, GetUserProfileResponse200, GetWalletCustomerMetadataParam, GetWalletCustomerResponse200, GetWalletMetadataParam, GetWalletResponse200, PatchMerchantProfileBodyParam, PatchMerchantProfileMetadataParam, PatchMerchantProfileResponse200, PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9BodyParam, PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9MetadataParam, PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9Response200, PatchTeamRoles36Fb6CdcC10745509A2B2C23Ec8A78B9Response400, PostAuthLoginBodyParam, PostAuthLoginResponse200, PostAuthLogoutMetadataParam, PostAuthPasswordForgetBodyParam, PostAuthPasswordForgetMetadataParam, PostAuthPasswordForgetResponse200, PostAuthPasswordResetBodyParam, PostAuthPasswordResetResponse200, PostAuthRefreshTokenBodyParam, PostAuthRefreshTokenMetadataParam, PostAuthRefreshTokenResponse200, PostAuthRefreshTokenResponse400, PostCardActivateBodyParam, PostCardActivateMetadataParam, PostCardActivateResponse200, PostCardBodyParam, PostCardFundBodyParam, PostCardFundMetadataParam, PostCardFundResponse200, PostCardMetadataParam, PostCardResponse200, PostMerchantAccountModeBodyParam, PostMerchantAccountModeMetadataParam, PostMerchantAccountModeResponse200, PostMerchantAccountModeResponse400, PostMerchantBodyParam, PostMerchantFundWalletBodyParam, PostMerchantFundWalletMetadataParam, PostMerchantFundWalletResponse200, PostMerchantGenerateAccessKeysMetadataParam, PostMerchantGenerateAccessKeysResponse200, PostMerchantResponse201, PostMerchantVerifyResendBodyParam, PostMerchantVerifyResendMetadataParam, PostMerchantVerifyResendResponse200, PostTeamInvitationsAcceptBodyParam, PostTeamInvitationsAcceptMetadataParam, PostTeamInvitationsAcceptResponse400, PostTeamInvitationsBodyParam, PostTeamInvitationsMetadataParam, PostTeamInvitationsResendBodyParam, PostTeamInvitationsResendMetadataParam, PostTeamInvitationsResendResponse200, PostTeamInvitationsResponse200, PostTeamMerchantsSwitchBodyParam, PostTeamMerchantsSwitchMetadataParam, PostTeamMerchantsSwitchResponse200, PostTeamRolesBodyParam, PostTeamRolesMetadataParam, PostTeamRolesResponse200, PostTransactionApproveBodyParam, PostTransactionApproveMetadataParam, PostTransactionApproveResponse200, PostTransferBankBatchBodyParam, PostTransferBankBatchMetadataParam, PostTransferBankBatchResponse200, PostTransferBankBodyParam, PostTransferBankCustomerBodyParam, PostTransferBankCustomerMetadataParam, PostTransferBankCustomerResponse200, PostTransferBankMetadataParam, PostTransferBankResponse200, PostTransferWalletBodyParam, PostTransferWalletMetadataParam, PostTransferWalletResponse200, PostWalletBatchCreditCustomerWalletBodyParam, PostWalletBatchCreditCustomerWalletMetadataParam, PostWalletBatchCreditCustomerWalletResponse200, PostWalletBatchDebitCustomerWalletBodyParam, PostWalletBatchDebitCustomerWalletMetadataParam, PostWalletBatchDebitCustomerWalletResponse200, PostWalletBodyParam, PostWalletCloseBodyParam, PostWalletCloseMetadataParam, PostWalletCloseResponse200, PostWalletCreditBodyParam, PostWalletCreditMetadataParam, PostWalletCreditResponse200, PostWalletCustomerBatchCreditCustomerWalletBodyParam, PostWalletCustomerBatchCreditCustomerWalletMetadataParam, PostWalletCustomerBatchCreditCustomerWalletResponse200, PostWalletDebitBodyParam, PostWalletDebitMetadataParam, PostWalletDebitResponse200, PostWalletEnableBodyParam, PostWalletEnableMetadataParam, PostWalletEnableResponse200, PostWalletMetadataParam, PostWalletResponse200, PostWalletReverseBatchTransactionBodyParam, PostWalletReverseBatchTransactionMetadataParam, PostWalletReverseBatchTransactionResponse400, PutCardSetupBodyParam, PutCardSetupMetadataParam, PutCardSetupResponse200, PutCustomer6834B937Bdf0430E960090009Cd5C92EBodyParam, PutCustomer6834B937Bdf0430E960090009Cd5C92EMetadataParam, PutCustomer6834B937Bdf0430E960090009Cd5C92EResponse200, PutMerchantCompleteMerchantRegistrationResponse200, PutMerchantVerifyBodyParam, PutMerchantVerifyResponse200, PutTeamMember0B9Bce55Fb6A4249A08B5Fb6802FebacBodyParam, PutTeamMember0B9Bce55Fb6A4249A08B5Fb6802FebacMetadataParam, PutTeamMember0B9Bce55Fb6A4249A08B5Fb6802FebacResponse200, PutUserPasswordBodyParam, PutUserPasswordMetadataParam, PutUserPasswordResponse200 } from './types';
