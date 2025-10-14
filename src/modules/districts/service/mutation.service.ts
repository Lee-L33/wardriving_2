import { AppDataSource } from "../../../database/dbConnect";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import logger from "../../../middlewares/logger";
import { District } from "../district.entity";

export class MutationServices {
    static districtRepository = AppDataSource.getRepository(District);


    static async createDistrict(data: District): Promise<IOneResponse> {
        try { 
            //Validate data
            
            if (!data.districtCode) {
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "DistrictCode must required",
                    error: {},
                });
            };
            if (!data.districtName) {
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "DistrictName must required",
                    error: {},
                });
            };

            //Exist code
            const codeExist = await this.districtRepository.findOneBy({ districtCode: data.districtCode});
            if (codeExist) {
                return handleErrorOneResponse({
                    code: "CODE_ALREADY_EXIST",
                    message: "This code already exist",
                    error: {},
                }); 
            };

            //Exist name
            const nameExist = await this.districtRepository.findOneBy({ districtName: data.districtName});
            if (nameExist) {
                return handleErrorOneResponse({
                    code: "CODE_ALREADY_EXIST",
                    message: "This name already exist",
                    error: {},
                }); 
            };

            //Create district
            const createDistrict = await this.districtRepository.save(data);

            //Return to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Create district success",
                data: {createDistrict},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "createDistrict error",
                err: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async updateDistrict(id: number, provinceId: number, data: District): Promise<IOneResponse> {
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

            //Check district
            const district = await this.districtRepository.findOneBy({ id: districtId });
            if (!district) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "District not found",
                    error: {},
                });
            };

            //Exist code
            const codeExist = await this.districtRepository.findOneBy({ districtCode: data.districtCode });
            if (codeExist) {
                return handleErrorOneResponse({
                    code: "ALREADY_EXIST",
                    message: "This code already exist",
                    error: {},
                });
            };

            //Exist name
            const nameExist = await this.districtRepository.findOneBy({ districtName: data.districtName });
            if (nameExist) {
                return handleErrorOneResponse({
                    code: "ALREADY_EXIST",
                    message: "This name already exist",
                    error: {},
                });
            };

            //Update data
            this.districtRepository.merge(district, data);
            const updateDistrict = await this.districtRepository.save(district);

            //return to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Update district success",
                data: {updateDistrict},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "updateDistrict error",
                err: error instanceof Error ? error: new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async deleteDistrict(id: number, provinceId: number): Promise<IOneResponse> {
        try {
            //Read id from params
            const districtId = id;
            if (!districtId) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing districtId",
                    error: {},
                });
            };

            //Check district
            const district = await this.districtRepository.findOneBy({ id, provinceId });

            if (!district) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "District not found",
                    error: {},
                });
            };

            //Delete district and return to client
            await this.districtRepository.delete(districtId);
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete district success",
                data: {},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "deleteDistrict error",
                err: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SEERVER_ERROR",
                message: "An unexpected error occurred",
                error: {},
            });
        };
    };
};