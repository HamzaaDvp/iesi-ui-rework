export interface ISessionToken {
  access_token: string;
  refresh_token: string;
}

export interface ITokenPayload extends Record<string, string> {
  client_id: 'string';
  client_secret: 'string';
}

export interface IPasswordTokenPayload extends ITokenPayload {
  grant_type: 'password';
  username: 'string';
  password: 'string';
}

export interface IRefreshTokenPayload extends ITokenPayload {
  grant_type: 'refresh_token';
  refresh_token: 'string';
}

export interface IRequestErrorBody {
  error: string,
  error_description: string
}
