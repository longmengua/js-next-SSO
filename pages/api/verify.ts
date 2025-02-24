import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/constants";

// 這個 API 用來驗證用戶的 JWT 是否有效
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.json({ message: "Method is not allowed" });
    }
    try {
        // 從 Cookie 或標頭中提取 token
        const token = req.cookies.sso_token || req.headers["authorization"]?.split(" ")[1]; // 若 token 在 cookies 或 Authorization 標頭中

        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        // 驗證 token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 如果驗證成功，回傳用戶資料
        res.status(200).json({ user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
