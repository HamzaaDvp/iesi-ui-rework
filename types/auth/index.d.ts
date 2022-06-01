export interface ITokenPayload extends Record<string, string>{
    grant_type: 'password' | 'refresh_token';
    client_id: string;
    client_secret: string;
    username?: string;
    password?: string;
    refresh_token?: string;
}