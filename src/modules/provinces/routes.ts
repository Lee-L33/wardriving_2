import express, { Request, Response } from "express";
import { MutationServices } from "./service/mutation.services";
import { handleErrorManyResponse, handleErrorOneResponse } from "../../utils";
import { QueryServices } from "./service/query.services";
import { authenticatetoken } from "../../middlewares";


const provinceRoute = express();

provinceRoute.post("/create", authenticatetoken, async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await MutationServices.createProvince(data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

provinceRoute.get("/get-one/:provinceId", authenticatetoken, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.provinceId);
        const result = await QueryServices.getOne(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

provinceRoute.put("/update/:provinceId", authenticatetoken, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.provinceId);
        const data = req.body;
        const result = await MutationServices.updateProvince(id, data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

provinceRoute.get("/get-all", authenticatetoken, async (req: Request, res: Response) => {
    try {
        const result = await QueryServices.getAll();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorManyResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

provinceRoute.delete("/delete/:provinceId", authenticatetoken, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.provinceId);
        const result = await MutationServices.deleteProvince(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SSERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

export default provinceRoute;