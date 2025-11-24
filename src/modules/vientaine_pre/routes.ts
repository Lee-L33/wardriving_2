import express, { Request, Response } from "express";
import { handleErrorManyResponse, handleErrorOneResponse } from "../../utils";
import { MutationServices } from "./services/mutation.services";
import { QueryServices } from "./services/query.services";

const vientaine_preRoutes = express();

vientaine_preRoutes.post("/create", async (req: Request, res: Response) => {
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

vientaine_preRoutes.get("/get-one/:id", async (req: Request, res: Response) => {
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

vientaine_preRoutes.get("/get-all", async (res: Response) => {
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

export default vientaine_preRoutes;