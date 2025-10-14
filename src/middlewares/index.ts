import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { handleErrorOneResponse } from "../utils";
import { User } from "../modules/users/user.entity";
import dotenv from "dotenv";
dotenv.config();

export const authenticatetoken = ( req: Request, res: Response, next: NextFunction ) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            res.status(401).json(handleErrorOneResponse({
                code: "UNAUTHORIZED",
                message: "Unauthenticated",
                error: {},
            }));
            return;
        };

        const secret_key = process.env.JWT_SECRET as string;
        if (!secret_key) {
            res.status(404).json(handleErrorOneResponse({
                code: "secret_key not found",
                message: "JWT_SECRET missing in .env",
                error: {},
            }));
        };
        token = token.replace("Bearer ", "");
        const decodeData = jwt.verify(token, secret_key) as User;
        const userId = decodeData.id;

        if (!req.body) req.body = {};
        req.body.userId = userId;
        next();
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error
        }));
    };
};

export const decodeUserDataFromToken = (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return handleErrorOneResponse({
                code: "UNAUTHORIZED",
                message: "Unauthenticated",
                error: {},
            });
        };

        token = token.replace("Bearer ", "");

        const decodeData = jwt.verify(token, process.env.JWT_SECRET || "secret_key") as User;
        return decodeData;
    } catch (error: any) {
        return handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error,
        });
    }; 
};