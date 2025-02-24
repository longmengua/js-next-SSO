import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { IS_PROD, COOKIE_DOMAIN } from "@/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.json({ message: "Method is not allowed" });
    }
    try {
        res.setHeader("Set-Cookie", [
            serialize("sso_token", '', {
                httpOnly: true,
                secure: IS_PROD,  // 只有 production 才用 Secure
                sameSite: IS_PROD ? "none" : "lax", // localhost 不能用 none
                domain: IS_PROD ? COOKIE_DOMAIN : undefined, // 只在正式環境設定 domain
                path: "/",
                maxAge: 15 * 60,
            }),
            serialize("sso_refresh", '', {
                httpOnly: true,
                secure: IS_PROD,
                sameSite: IS_PROD ? "none" : "lax",
                domain: IS_PROD ? COOKIE_DOMAIN : undefined,
                path: "/",
                maxAge: 7 * 24 * 60 * 60,
            }),
        ]);

        // 如果驗證成功，回傳用戶資料
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        res.status(401).json({ message: "Logout failed" });
    }
}
