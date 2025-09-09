import { handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
import { User } from "../user.entity";
import argon2 from "argon2";
import { AppDataSource } from "../../../database/dbConnect";
import { IOneResponse } from "../../../types/base";

export class MutationServices {
    static userRepository = AppDataSource.getRepository(User);

    static async createUser(data: User): Promise<IOneResponse> {
        try {
            //validate data
            if (!data.fullname){
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "Fullname must required",
                    error: {},
                });
            };

            if (!data.email){
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "Email must required",
                    error: {},
                });
            };

            if (!data.password){
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "Password must required",
                    error: {},
                });
            };

            //check email exist
            const emailExist  = await this.userRepository.findOne({ where: {email: data.email}});
            if (emailExist){
                return handleErrorOneResponse({
                    code: "EMAIL_ALREADY_EXIST",
                    message: "This email is already exist",
                    error: {},
                });
            };

            //hash password
            const hashPW = await argon2.hash(data.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16, //64mb
                timeCost: 4,
                parallelism: 1,
            });
            data.password = hashPW;

            //Insert data
            const createUser = await this.userRepository.save(data);

            return handleSuccessOneResponse({
                code: "USER_CREATED",
                message: "Create user success",
                data: {createUser},
            });
        } catch (error: any) { 
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                error,
            });
        };
    };

    static async updateUser(id: number, data: User): Promise<IOneResponse> {
        try {
            //check id
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing Id",
                    error: {},
                });
            };

            //Find user by id
            const user = await this.userRepository.findOne({ where: {id}});
            if (!user) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "User not found",
                    error: {},
                });
            };

            //Check email exist
            const existEmail = await this.userRepository.findOne({ where: {email: data.email}});
            if(existEmail) {
                return handleErrorOneResponse({
                    code: "EMAIL_ALREADY_EXIST",
                    message: "This email is already exist",
                    error: {},
                });
            };
            
            //Hash password
            const hashPW = await argon2.hash(data.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16, //64mb
                timeCost: 4,
                parallelism: 1,
            });
            data.password = hashPW;

            //Update user
            const updateUser = await this.userRepository.save({ ...user, ...data, id });
            return handleSuccessOneResponse({
                code: "USER_UPDATED",
                message: "Update user success",
                data: {updateUser},
            });
        } catch (error: any) {
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: error.message,
                error,
            });
        };
    };

    static async deleteUser(id: number): Promise<IOneResponse> {
        try {
            //check id
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing Id",
                    error: {},
                });
            };

            //Find user by id
            const user = await this.userRepository.findOne({ where: {id}});
            if( !user) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "User not found",
                    error: {},
                });
            };

            //Delete uesr
            await this.userRepository.delete({id});
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete user success",
                data: {},
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
