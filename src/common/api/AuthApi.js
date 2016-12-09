import type PayeverApi from './index';
import { showScreen } from '../Navigation';

export default class AuthApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response: AuthResponse = await this.client.fetch('/oauth/v2/token', {
      query: {
        username,
        password,
        client_id:     this.client.clientId,
        client_secret: this.client.clientSecret,
        grant_type:    'password'
      },
      preventTokenRefresh: true
    });

    if (response.ok) {
      this.client.authStore.updateTokens({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token
      });
    }

    return response;
  }

  async refreshToken(refreshToken): Promise<string> {
    const response: AuthResponse = await this.client.fetch('/oauth/v2/token', {
      query: {
        client_id:     this.client.clientId,
        client_secret: this.client.clientSecret,
        grant_type:    'refresh_token',
        refresh_token: refreshToken
      },
      preventTokenRefresh: true
    });

    if (response.ok) {
      this.client.authStore.updateTokens({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token
      });
      console.log('New token is set', [this.client, response.data]);
    } else {
      showScreen('auth.Login');
      console.error('Could not refresh token: ', response.data);
    }

    return response.data.access_token;
  }
}

type AuthResponse = {
  data: {
    access_token: string;
    expires_in: string;
    refresh_token: string;

    error: string;
    error_description: string;
  },
  ok: boolean,
}