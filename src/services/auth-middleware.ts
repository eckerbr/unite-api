import { Request, Response, NextFunction } from "express";
import UserData from "../types/user-data";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
    userData?: UserData;
}

export const adminAuth = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const bearerToken: string | undefined = req.headers.authorization;

    if (!bearerToken || bearerToken.trim().length === 0) {
        return res.status(401).json({
            message: "Unauthorized access attempted",
        });
    }

    const token: string = bearerToken.split(" ")[1];
    if (!token || token.length === 0) {
        return res.status(401).json({
            message: "Unauthorized access attempted",
        });
    }

    try {
        const decoded: any = jwt.verify(token, process.env["JWT_KEY"] || "");

        if (decoded.Admin) {
            const decodedData: UserData = {
                email: decoded.Email,
                userId: decoded.Id,
                userName: decoded.UserName,
                isAdmin: decoded.Admin,
                token: token,
            };

            req.userData = decodedData;
            next();
        } else {
            return res.status(401).json({
                message: "Unauthorized access attempted",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized access attempted",
        });
    }
};

export const userAuth = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const bearerToken: string | undefined = req.headers.authorization;

    if (!bearerToken || bearerToken.trim().length === 0) {
        return res.status(401).json({
            message: "Unauthorized access attempted",
        });
    }

    const token: string = bearerToken.split(" ")[1];
    if (!token || token.length === 0) {
        return res.status(401).json({
            message: "Unauthorized access attempted",
        });
    }

    try {
        const decoded: any = jwt.verify(token, process.env["JWT_KEY"] || "");

        const decodedData: UserData = {
            email: decoded.Email,
            userId: decoded.Id,
            userName: decoded.UserName,
            isAdmin: decoded.Admin,
            token: token,
        };

        req.userData = decodedData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized access attempted",
        });
    }
};
