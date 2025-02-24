import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";
import { generateTokens } from "@/hooks/auth";
import { COOKIE_DOMAIN, IS_PROD } from "@/constants";

// 模擬用戶資料庫
const users = [{ id: "1", username: "admin", password: "123" }];

// 儲存 Refresh Tokens
const refreshTokens: Map<string, string> = new Map<string, string>();

// 登入 API
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.json({ message: "Method is not allowed" });
    }
    try {
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username && u.password === password);

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const deviceId = uuidv4();
        const { accessToken, refreshToken } = generateTokens(refreshTokens, user.id, deviceId);

        res.setHeader("Set-Cookie", [
            serialize("sso_token", accessToken, {
                httpOnly: true,
                secure: IS_PROD,  // 只有 production 才用 Secure
                sameSite: IS_PROD ? "none" : "lax", // localhost 不能用 none
                domain: IS_PROD ? COOKIE_DOMAIN : undefined, // 只在正式環境設定 domain
                path: "/",
                maxAge: 15 * 60,
            }),
            serialize("sso_refresh", refreshToken, {
                httpOnly: true,
                secure: IS_PROD,
                sameSite: IS_PROD ? "none" : "lax",
                domain: IS_PROD ? COOKIE_DOMAIN : undefined,
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
            }),
        ]);

        return res.json({ message: "Login successful" });
    } catch (error) {
        return res.json({ message: "Login failed" });
    }
}
