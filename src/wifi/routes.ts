import express, { Request, Response } from "express";
import { MutationServices } from "./service/mutation.service";
import { QueryServices } from "./service/query.service";
import logger from "../middlewares/logger";
import { handleErrorManyResponse, handleErrorOneResponse } from "../utils";

const wifiRoute = express();

// Create single network
wifiRoute.post("/create", async (req: Request, res: Response) => {
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
    }
});

// Bulk create networks
wifiRoute.post("/bulk-create", async (req: Request, res: Response) => {
    try {
        const dataArray = req.body;
        const result = await MutationServices.bulkCreateNetworks(dataArray);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Get single network by ID
wifiRoute.get("/get-one/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await QueryServices.getNetwork(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Get all networks with optional filters
wifiRoute.get("/get-all", async (req: Request, res: Response) => {
    try {
        const filters = {
            district: req.query.district as string,
            authentication: req.query.authentication as string,
            encryption: req.query.encryption as string,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            offset: req.query.offset ? Number(req.query.offset) : undefined,
        };
        const result = await QueryServices.getAllNetworks(filters);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorManyResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Get networks by district
wifiRoute.get("/district/:district", async (req: Request, res: Response) => {
    try {
        const district = req.params.district;
        const result = await QueryServices.getNetworksByDistrict(district);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorManyResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Get network by BSSID
wifiRoute.get("/bssid/:bssid", async (req: Request, res: Response) => {
    try {
        const bssid = req.params.bssid;
        const result = await QueryServices.getNetworkByBSSID(bssid);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Search networks
wifiRoute.get("/search", async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const result = await QueryServices.searchNetworks(query);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorManyResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Update network
wifiRoute.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const result = await MutationServices.updateNetwork(id, data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

// Delete network
wifiRoute.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await MutationServices.deleteNetwork(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    }
});

export default wifiRoute;
