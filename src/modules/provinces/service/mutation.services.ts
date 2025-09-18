import { AppDataSource } from "../../../database/dbConnect";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import { Province } from "../province.entity";
import logger from "../../../middlewares/logger";

export class MutationServices {
    static userRepository = AppDataSource.getRepository(Province);

    static async createProvince(data: Province): Promise<IOneResponse> {
        try {
            //Validate data
            if (!data.provinceCode) {
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "ProvinceCode must required",
                    error: {},
                });
            };
            if (!data.provinceName) {
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "ProvinceName must required",
                    error: {},
                });
            };

            //Exist code
            const codeExist = await this.userRepository.findOneBy({ provinceCode: data.provinceCode});
            if (codeExist) {
                return handleErrorOneResponse({
                    code: "CODE_ALREADY_EXIST",
                    message: "This code already exist",
                    error: {},
                }); 
            };

            //Exist name
            const nameExist = await this.userRepository.findOneBy({ provinceName: data.provinceName});
            if (nameExist) {
                return handleErrorOneResponse({
                    code: "CODE_ALREADY_EXIST",
                    message: "This name already exist",
                    error: {},
                }); 
            };

            //Create province
            const createProvince = await this.userRepository.save(data);

            //Return to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Create province success",
                data: {createProvince},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "createProvince error",
                err: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async updateProvince(id: number, data: Province): Promise<IOneResponse> {
        try {
            //Read id from params
            const province_id = id;

            //Check id
            if (!province_id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing province_id",
                    error: {},
                });
            };

            //Check province
            const province = await this.userRepository.findOneBy({ id: province_id });
            if (!province) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "Province not found",
                    error: {},
                });
            };

            //Exist code
            const codeExist = await this.userRepository.findOneBy({ provinceCode: data.provinceCode });
            if (codeExist) {
                return handleErrorOneResponse({
                    code: "ALREADY_EXIST",
                    message: "This code already exist",
                    error: {},
                });
            };

            //Exist name
            const nameExist = await this.userRepository.findOneBy({ provinceName: data.provinceName });
            if (nameExist) {
                return handleErrorOneResponse({
                    code: "ALREADY_EXIST",
                    message: "This name already exist",
                    error: {},
                });
            };

            //Update data
            this.userRepository.merge(province, data);
            const updateProvince = await this.userRepository.save(province);

            //return to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Update province success",
                data: {updateProvince},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "updatePronvince error",
                err: error instanceof Error ? error: new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async deleteProvince(id: number): Promise<IOneResponse> {
        try {
            //Read id from params
            const province_id = id;
            if (!province_id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing province_id",
                    error: {},
                });
            };

            //Check province
            const province = await this.userRepository.findOneBy({ id: province_id });

            if (!province) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "Province not found",
                    error: {},
                });
            };

            //Delete province and return to client
            await this.userRepository.delete(province_id);
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete province success",
                data: {},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "deleteprovince error",
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