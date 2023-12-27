import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
        success: false,
        message: "User not logged in",
        });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        next();
    } 
    catch (error) {

        return res.status(401).json({
        success: false,
        message: "Invalid token",
        });
    }
};

