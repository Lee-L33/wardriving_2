import { AppDataSource } from "../../../database/dbConnect";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
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
            if (error instanceof Error) {
                console.error("getOne Error: ", error.stack);
                return handleErrorOneResponse({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                    error: {},
                });
            };
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "Unknown error",
                error: {},
            });
        };
    };

    static async getMany(): Promise<IOneResponse> {
        try {
            //Count total users
            const totalUsers = await this.userRepository.count({});

            //Get users data
            const users = await this.userRepository.find({});
            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: "Get users all success",
                total: totalUsers,
                data: users.map((user) => {
                    return {...user, password: null};
                })
            });
        } catch (error: any) {
            if (error instanceof Error) {
                console.error("getmany Error: ", error.stack);
                return handleErrorOneResponse({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                    error: {},
                });
            };
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "Unknown error",
                error: {},
            });
        };
    };
};