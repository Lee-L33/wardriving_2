import { AppDataSource } from "../../../database/dbConnect";
import { IManyResponse, IOneResponse } from "../../../types/base";
import { handleErrorManyResponse, handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
import logger from "../../../middlewares/logger";
import { District } from "../district.entity";

export class QueryServices {
    static districtRepository = AppDataSource.getRepository(District);

    static async getOne(id: number): Promise<IOneResponse> {
        try {
            //Read id from params
            const districtId = id;

            //Check id
            if (!districtId) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing districtId",
                    error: {},
                });
            };

            //Get district from id
            const district = await this.districtRepository.findOneBy({ id: districtId });
            if (!district) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "District not found",
                    error: {},
                });
            };
            
            //Return to client
            return handleSuccessOneResponse({
                code: "SUCESS",
                message: "Get district success",
                data: {district},
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
            //Count alldistricts
            const totalDistricts = await this.districtRepository.count({});

            //Get districts data and return to client
            const districts = await this.districtRepository.find({});
            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: "Get all districts success",
                total: totalDistricts,
                data: {districts},
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