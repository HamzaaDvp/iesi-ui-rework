export const check_token = (params: any) => `/oauth/check_token?${new URLSearchParams(params)}`
export const login = (params: any) => `/api/login?${new URLSearchParams(params)}`