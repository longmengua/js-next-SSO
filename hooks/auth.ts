import { JWT_SECRET, REFRESH_SECRET, API_URL } from "@/constants";
import axios from "axios";
import jwt from "jsonwebtoken";

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
        const response = await axios.post(`${API_URL}/api/login`, { username, password }, { withCredentials: true });

        return response.data;
    } catch (error) {
        throw new Error("Login failed");
    }
};

// **取得登入狀態**
export const checkAuth = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/verify`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return null;
    }
};

// **登出**
export const logout = async () => {
    await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
};
