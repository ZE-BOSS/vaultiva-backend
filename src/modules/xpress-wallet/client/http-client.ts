import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { XpressWalletConfig, AuthTokens, ErrorResponse } from '../types/common';
import { LoginRequest, LoginResponse } from '../xpress-wallet-sdk';

export class XpressWalletError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'XpressWalletError';
  }
}

// Extend Axios config to support _retry flag
interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export class HttpClient {
  private client: AxiosInstance;
  private tokens: AuthTokens | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor(private config: XpressWalletConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Explicit init method (call after instantiating)
  async init(): Promise<void> {
    const { tokens } = await this.login({
      email: this.config.xpressEmail,
      password: this.config.xpressPassword,
    });
    
    this.setTokens(tokens);
    this.setupInterceptors();
  }

  async login(credentials: LoginRequest): Promise<{ 
    response: LoginResponse; 
    tokens: AuthTokens;
  }> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);

    const tokens: AuthTokens = {
      accessToken: response.headers['x-access-token'],
      refreshToken: response.headers['x-refresh-token']
    };

    this.setTokens(tokens);

    return {
      response: response.data,
      tokens
    };
  }

  setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    this.setBearerToken(tokens.accessToken);
  }

  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  clearTokens(): void {
    this.tokens = null;
    this.clearBearerToken();
  }

  setBearerToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearBearerToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth headers
    this.client.interceptors.request.use((config) => {
      if (this.tokens) {
        config.headers['X-Access-Token'] = this.tokens.accessToken;
        config.headers['X-Refresh-Token'] = this.tokens.refreshToken;
      }
      return config;
    });

    // Response interceptor to handle token refresh and errors
    this.client.interceptors.response.use(
      (response) => {
        // Update tokens if new ones are provided in response headers
        const newAccessToken = response.headers['x-access-token'];
        const newRefreshToken = response.headers['x-refresh-token'];

        if (newAccessToken && newRefreshToken && this.tokens) {
          this.tokens.accessToken = newAccessToken;
          this.tokens.refreshToken = newRefreshToken;
          this.setBearerToken(newAccessToken);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config as RetryAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          this.tokens?.refreshToken &&
          !originalRequest._retry
        ) {
          if (this.refreshPromise) {
            await this.refreshPromise;
            return this.client(originalRequest);
          }

          originalRequest._retry = true;
          this.refreshPromise = this.refreshTokens();

          try {
            await this.refreshPromise;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            throw new XpressWalletError(
              'Authentication failed. Please login again.',
              401
            );
          } finally {
            this.refreshPromise = null;
          }
        }

        if (error.response) {
          const errorData: ErrorResponse = error.response.data;
          throw new XpressWalletError(
            errorData.message || 'API request failed',
            error.response.status,
            errorData
          );
        }

        throw new XpressWalletError(
          error.message || 'Network error occurred'
        );
      }
    );
  }

  private async refreshTokens(): Promise<void> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(
        `${this.config.baseUrl}/auth/refresh/token`,
        {},
        {
          headers: {
            'X-Refresh-Token': this.tokens.refreshToken,
            'Content-Type': 'application/json',
          },
        }
      );

      const newAccessToken = response.headers['x-access-token'];
      const newRefreshToken = response.headers['x-refresh-token'];

      if (newAccessToken && newRefreshToken) {
        this.tokens.accessToken = newAccessToken;
        this.tokens.refreshToken = newRefreshToken;
        this.setBearerToken(newAccessToken);
      } else {
        throw new Error('Failed to refresh tokens');
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}
