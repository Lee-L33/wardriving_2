import express, { Request, Response } from "express";
import { handleErrorOneResponse } from "../../utils";
import { MutationServices } from "./services/mutation.services";

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
        
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL SERVER ERROR",
            message: error.message,
            error: {},
        }));
    };
});

export default vientaine_preRoutes;