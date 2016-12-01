import type PayeverApi from '../../../common/PayeverApi';

declare class AuthResponse extends Response {
  data: {
    access_token: string,
    expires_in: string,
    refresh_token: string
  }
}

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
      }
    });

    if (response.ok) {
      this.client.setConfig({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token
      });
    }

    return response;
  }

  async refreshToken(refreshToken): string {
    const response: AuthResponse = await this.client.fetch('/oauth/v2/token', {
      query: {
        client_id:     this.client.clientId,
        client_secret: this.client.clientSecret,
        grant_type:    'refresh_token',
        refresh_token: refreshToken
      }
    });

    if (response.ok) {
      this.client.setConfig({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token
      });
    } else {
      console.error('Could not refresh token: ', response.data);
    }

    return response.data.access_token;
  }
}