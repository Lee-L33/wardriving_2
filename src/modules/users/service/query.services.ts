import { AppDataSource } from "../../../database/dbConnect";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
import { User } from "../user.entity";


export class QueryServices {
    static userRepository = AppDataSource.getRepository(User);

    static async getOne(id:  number): Promise<IOneResponse> {
        try {
            //check id
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing Id",
                    error: {},
                });
            };
            //Get user from id
            const user = await this.userRepository.findOne({ where: {id}});
            if (!user) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
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
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                error,
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
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                error,
            });
        };
    };
};