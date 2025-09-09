import express, {Request, Response} from "express";
import { handleErrorManyResponse, handleErrorOneResponse } from "../../utils";
import { MutationServices } from "./service/mutation.services";
import { QueryServices } from "./service/query.services";

const userRoute = express();

userRoute.post("/create", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await MutationServices.createUser(data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error,
        }));
    };
});

userRoute.get("/get-one/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await QueryServices.getOne(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error,
        }));
    };
});

userRoute.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const result = await MutationServices.updateUser(id, data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error,
        }));
    };
});

userRoute.get("/get-many", async (req: Request, res: Response) => {
    try {
        const result = await QueryServices.getMany();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorManyResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error,
        }));
    };
});

userRoute.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await MutationServices.deleteUser(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error,
        }));
    };
});

export default userRoute;