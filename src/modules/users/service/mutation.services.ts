import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import { User } from "../user.entity";
import argon2 from "argon2";
import { AppDataSource } from "../../../database/dbConnect";
import { IOneResponse } from "../../../types/base";
import jwt from "jsonwebtoken";
import logger from "../../../middlewares/logger";

export class MutationServices {
    static userRepository = AppDataSource.getRepository(User);

    static async createUser(data: User): Promise<IOneResponse> {
        try {
            //validate data
            if (!data.username){
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "Username must required",
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
            const emailExist  = await this.userRepository.findOneBy({ email: data.email });
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
                timeCost: 3,
                parallelism: 1,
            });
            data.password = hashPW;

            //Insert data
            const createUser = await this.userRepository.save(data);

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Create user success",
                data: {createUser},
            });
        } catch (error: unknown) { 
            if (error instanceof Error) {
                console.error("createUser Error: ", error.stack);
                return handleErrorOneResponse({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message,
                    error: {},
                });
            };
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "unknown error",
                error: {},
            });
        };
    };

    static async updateUser(id: number, data: User): Promise<IOneResponse> {
        try {
            //Recieve data from client
            const user_id = id;
            
            if (!user_id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing user_id",
                    error: {},
                });
            };

            //Find user by id
            const user = await this.userRepository.findOneBy({ id: user_id});
            if (!user) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "User not found",
                    error: {},
                });
            };

            //Check email exist
            if (data.email) {
                const existEmail = await this.userRepository.findOneBy({ email: data.email}); 
                if(existEmail) { 
                    return handleErrorOneResponse({ 
                        code: "EMAIL_ALREADY_EXIST", 
                        message: "This email is already exist", 
                        error: {}, 
                    }); 
                };
            };
            
            //Hash password
            const hashPW = await argon2.hash(data.password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16, //64mb
                timeCost: 3,
                parallelism: 1,
            }); 
            data.password = hashPW;

            //Update user
            this.userRepository.merge(user, data);
            const updateUser = await this.userRepository.save(user);

            return handleSuccessOneResponse({
                code: "USER_UPDATED",
                message: "Update user success",
                data: { ...updateUser, password: null },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "update user error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async deleteUser(id: number): Promise<IOneResponse> {
        try {
            //Read id from params
            const user_id = id;

            if (!user_id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing user_id",
                    error: {},
                });
            };

            //Find user by id
            const user = await this.userRepository.findOneBy({ id: user_id });
            
            if( !user) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "User not found",
                    error: {},
                });
            };

            //Delete uesr
            await this.userRepository.delete(user_id);

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete user success",
                data: {},
            });
        } catch (error: unknown) {
            logger.error({
                msg: "delete user error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async userRegister(data: User): Promise<IOneResponse> {
        try {
            //validate data
            if (!data.username){
                return handleErrorOneResponse({
                    code: "DATA_REQUIRED",
                    message: "Username must required",
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
            const emailExist  = await this.userRepository.findOneBy({ email: data.email });
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
                timeCost: 3,
                parallelism: 1,
            });
            data.password = hashPW;

            //Insert data
            const userRegister = await this.userRepository.save( data );

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Success to register user",
                data: {...userRegister, password: null},
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("userRegister Error: ", error.stack);
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

    static async userLogin(email: string, password: string): Promise<IOneResponse> {
        try {
            //1. Validate data input
            if (!email || !password) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Email or password must required",
                    error: {},
                });
            };

            //2. find email in system
            const emailExist = await this.userRepository.findOneBy({ email });
            if (!emailExist) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Email or password incorrect",
                    error: {},
                });
            };
 
            //3. Compare password
            const comparePassword = await argon2.verify( emailExist.password, password );
            if (!comparePassword) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Email or password incorrect",
                    error: {},
                });
            };

            //4. Generate token(key)
            const payload = {
                id: emailExist.id,
                fullname: emailExist.username,
            };

            const token = jwt.sign( payload, process.env.JWT_SECRET || "jwt_secret", { expiresIn: "1d" });

            //5. Return data to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                data: {
                    user: { ...emailExist, password: null },
                    token,
                },
                message: "Login success",
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("userLogin Error: ", error.stack);
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
