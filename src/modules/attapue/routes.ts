import express, { Request, Response } from "express";
import { MutationServices } from "./service/mutation.service";
import logger from "../../middlewares/logger";
import { handleErrorManyResponse, handleErrorOneResponse } from "../../utils";
import { QueryServices } from "./service/query.services";

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

attapueRoute.get("/get-one/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await QueryServices.get_network(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL SERVER ERROR",
            message: error.message,
            error: {},
        }));
    };
});

attapueRoute.get("/get-all", async (res: Response) => {
    try {
        const result = await QueryServices.getAll_network();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorManyResponse({
            code: "INTERNAL SERVER ERROR",
            message: error.message,
            error: {},
        }));
    };
});

export default attapueRoute;