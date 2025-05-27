import { auth } from "../utils/auth.js";

export const AuthMiddleware = async (req, res, next) => {
    try {
        const user = await auth(req); // Pass request/response
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
