import express, { Request, Response } from "express"
import { handleErrorOneResponse } from "../../../utils";

const app = express();
export const createUser = (req: Request, res: Response) => {
    app.post('/create', (req: Request, res: Response) => {
        try {
            const districtName = req.body;
        } catch (error: any) {
            res.status(500).json(handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                error,
            }));
        };
    });
};
   