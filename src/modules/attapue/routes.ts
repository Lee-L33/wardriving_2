import express, { Request, Response } from "express";
import { MutationServices } from "./service/mutation.service";
import logger from "../../middlewares/logger";
import { handleErrorOneResponse } from "../../utils";

const attapueRoute = express();

attapueRoute.post("/create", async (req: Request, res: Response) => {
    try { 
        const data = req.body;
        const result = await MutationServices.createNetwork(data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

export default attapueRoute;