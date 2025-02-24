export const API_URL = process.env.NEXT_PUBLIC_AUTH_SERVER;
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || ".example.com";
export const IS_PROD = process.env.NODE_ENV === "production";