import { JWT_SECRET, REFRESH_SECRET, API_URL } from "@/constants";
import axios from "axios";
import jwt from "jsonwebtoken";

// 刪除 Cookie
const deleteCookie = (name: string) => {
    // Secure 設定以後，只能在https。
    // document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly; SameSite=Strict`;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; HttpOnly; SameSite=Strict`;
};

// 產生 Token
export const generateTokens = (refreshTokens: Map<string, string>, userId: string, deviceId: string) => {
    const accessToken = jwt.sign({ userId, deviceId }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId, deviceId }, REFRESH_SECRET, { expiresIn: "7d" });

    refreshTokens.set(userId, refreshToken);
    return { accessToken, refreshToken };
};

// **登入**
export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth`, { username, password }, { withCredentials: true });

        return response.data;
    } catch (error) {
        throw new Error("Login failed");
    }
};

// **取得登入狀態**
export const checkAuth = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/auth/verify`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return null;
    }
};

// **登出**
export const logout = async () => {
    await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });

    // 手動刪除 Token
    deleteCookie("sso_token");
    deleteCookie("sso_refresh");
};
