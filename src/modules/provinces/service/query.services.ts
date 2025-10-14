import { AppDataSource } from "../../../database/dbConnect";
import { IManyResponse, IOneResponse } from "../../../types/base";
import { handleErrorManyResponse, handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
import { Province } from "../province.entity";
import logger from "../../../middlewares/logger";

export class QueryServices {
    static provinceRepository = AppDataSource.getRepository(Province);

    static async getOne(id: number): Promise<IOneResponse> {
        try {
            //Read id from params
            const provinceId = id;

            //Check id
            if (!provinceId) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing provinceId",
                    error: {},
                });
            };

            //Get province from id
            const province = await this.provinceRepository.findOneBy({ id: provinceId });
            if (!province) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "Province not found",
                    error: {},
                });
            };
            
            //Return to client
            return handleSuccessOneResponse({
                code: "SUCESS",
                message: "Get province success",
                data: {province},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "getOne error",
                err: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async getAll(): Promise<IManyResponse> {
        try {
            //Count allprovinces
            const totalProvinces = await this.provinceRepository.count({});

            //Get provinces data and return to client
            const provinces = await this.provinceRepository.find({});
            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: "Get all provinces success",
                total: totalProvinces,
                data: {provinces},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "getAll error",
                err: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorManyResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };
};