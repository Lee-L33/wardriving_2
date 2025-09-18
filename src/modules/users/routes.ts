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
            error: {},
        }));
    };
});
 
userRoute.get("/get-one/:user_id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.user_id);
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

userRoute.put("/update/:user_id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.user_id);
        const data = req.body;
        const result = await MutationServices.updateUser(id, data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
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
            error: {},
        }));
    };
});

userRoute.delete("/delete/:user_id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.user_id);
        const result = await MutationServices.deleteUser(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

userRoute.post("/register", async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await MutationServices.userRegister(data);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});

userRoute.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await MutationServices.userLogin( email, password );
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json(handleErrorOneResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            error: {},
        }));
    };
});
export default userRoute;