import express, { Request, Response } from "express";
import { handleErrorManyResponse, handleErrorOneResponse } from "../../utils";
import { MutationServices } from "./service/mutation.service";
import { QueryServices } from "./service/query.service";


const districtRoute = express();

districtRoute.post("/create", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await MutationServices.createDistrict(data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

districtRoute.get("/get-one/:districtId", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.districtId);
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

districtRoute.put("/update/:districtId", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.districtId);
        const provinceId = Number(req.params.provinceId);
        const data = req.body;
        const result = await MutationServices.updateDistrict(id, provinceId, data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

districtRoute.get("/get-all", async (req: Request, res: Response) => {
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

districtRoute.delete("/delete/:districtId", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.districtId);
        const provinceId = Number(req.params.provinceId);
        const result = await MutationServices.deleteDistrict(id, provinceId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SSERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

export default districtRoute;