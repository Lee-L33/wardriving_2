import { AppDataSource } from "../../../database/dbConnect";
import logger from "../../../middlewares/logger";
import { IManyResponse, IOneResponse } from "../../../types/base";
import { handleErrorManyResponse, handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
import { User } from "../user.entity";


export class QueryServices {
    static userRepository = AppDataSource.getRepository(User);

    static async getOne(id: number): Promise<IOneResponse> {
        try {
            //Read id from params
            const user_id = id;
            //check id
            if (!user_id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing user_id",
                    error: {},
                });
            };
            //Get user from id
            const user = await this.userRepository.findOneBy({ id: user_id });
            if (!user) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "User not found",
                    error: {},
                });
            };
            //Return to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Get user success",
                data: {...user, password: null},
            });
        } catch (error: any) {
            logger.error ({
                msg: "getOne error",
                err: error instanceof Error ? error: new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async getMany(): Promise<IManyResponse> {
        try {
            //Count total users
            const totalUsers = await this.userRepository.count({});

            //Get users data
            const users = await this.userRepository.find({});
            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: "Get all users success",
                total: totalUsers,
                data: users.map((user) => {
                    return {...user, password: null};
                }),
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "getMany error",
                err: error instanceof Error ? error: new Error(String(error)),
            });
            return handleErrorManyResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };
};