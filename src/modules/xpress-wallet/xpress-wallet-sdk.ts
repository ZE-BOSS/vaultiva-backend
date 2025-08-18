import { HttpClient } from './client/http-client';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { CustomerService } from './services/customer.service';
import { WalletService } from './services/wallet.service';
import { TransactionService } from './services/transaction.service';
import { TransferService } from './services/transfer.service';
import { TeamService } from './services/team.service';
import { MerchantService } from './services/merchant.service';
import { CardService } from './services/card.service';
import { XpressWalletConfig, AuthTokens } from './types/common';

export class XpressWalletSDK {
  private httpClient: HttpClient;

  public readonly auth: AuthService;
  public readonly user: UserService;
  public readonly customer: CustomerService;
  public readonly wallet: WalletService;
  public readonly transaction: TransactionService;
  public readonly transfer: TransferService;
  public readonly team: TeamService;
  public readonly merchant: MerchantService;
  public readonly card: CardService;

  constructor(config: XpressWalletConfig) {
    this.httpClient = new HttpClient(config);
    
    // Initialize all service modules
    this.auth = new AuthService(this.httpClient);
    this.user = new UserService(this.httpClient);
    this.customer = new CustomerService(this.httpClient);
    this.wallet = new WalletService(this.httpClient);
    this.transaction = new TransactionService(this.httpClient);
    this.transfer = new TransferService(this.httpClient);
    this.team = new TeamService(this.httpClient);
    this.merchant = new MerchantService(this.httpClient);
    this.card = new CardService(this.httpClient);
  }

  /**
   * Set authentication tokens for API requests
   */
  setTokens(tokens: AuthTokens): void {
    this.httpClient.setTokens(tokens);
  }

  /**
   * Get current authentication tokens
   */
  getTokens(): AuthTokens | null {
    return this.httpClient.getTokens();
  }

  /**
   * Clear authentication tokens
   */
  clearTokens(): void {
    this.httpClient.clearTokens();
  }

  /**
   * Set bearer token for API requests (alternative to session tokens)
   */
  setBearerToken(token: string): void {
    this.httpClient.setBearerToken(token);
  }

  /**
   * Clear bearer token
   */
  clearBearerToken(): void {
    this.httpClient.clearBearerToken();
  }

  /**
   * Check if SDK is authenticated
   */
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!(tokens?.accessToken && tokens?.refreshToken);
  }
}

// Export all types for convenience
export * from './types/common';
export * from './types/auth';
export * from './types/customer';
export * from './types/wallet';
export * from './types/transaction';
export * from './types/transfer';
export * from './types/team';
export * from './types/merchant';
export * from './types/card';
export * from './types/user';
export { XpressWalletError } from './client/http-client';