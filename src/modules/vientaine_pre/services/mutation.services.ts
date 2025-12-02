import { AppDataSource } from "../../../database/dbConnect";
import logger from "../../../middlewares/logger";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import { Vientaine_pre_network } from "../vientaine_pre.entity";

export class MutationServices {
    static vientaine_preRepository = AppDataSource.getRepository(Vientaine_pre_network);

    static async createNetwork(data: Vientaine_pre_network): Promise<IOneResponse> {
        try {
            // Validate district ID
            if (!data.district_id) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "District not found",
                    error: {},
                });
            }

            // Required fields
            const requiredFields: (keyof Vientaine_pre_network)[] = [
                "ssid",
                "bssid",
                "manufacturer",
                "signal_strength",
                "authentication",
                "encryption",
                "radio_type",
                "channel",
                "latitude",
                "longitude",
                "scan_timestamp",
                "network_identifier",
                "frequency"
            ];

            for (const field of requiredFields) {
                if (data[field] === undefined || data[field] === null || data[field] === "") {
                    return handleErrorOneResponse({
                        code: "DATA_REQUIRED",
                        message: `${field} is required`,
                        error: {},
                    });
                }
            }

            // Prevent duplicate BSSID
            const existing = await this.vientaine_preRepository.findOneBy({ bssid: data.bssid });

            if (existing) {
                return handleErrorOneResponse({
                    code: "DUPLICATE",
                    message: "This BSSID already exists.",
                    error: {},
                });
            }

            // Save the network
            const createNetwork = await this.vientaine_preRepository.save(data);

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Create vientaine_pre_network success",
                data: { createNetwork },
            });

        } catch (error: unknown) {
            logger.error({
                msg: "createNetwork error",
                error: error instanceof Error ? error : new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async updateNetwork(district_id: number, data: Vientaine_pre_network): Promise<IOneResponse> {
        try {
            const id = district_id;
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD REQUEST",
                    message: "Missing district_id",
                    error: {},
                });
            };

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Update network success",
                data: {},
            })
        } catch (error: unknown) {
            logger.error({
                msg: "update network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async deleteNetwork(district_id: number): Promise<IOneResponse> {
        try {
            const id = district_id;
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD REQUEST",
                    message: "Missing district_id",
                    error: {},
                });
            };

            const network = await this.vientaine_preRepository.findOneBy({ district_id: id });
            if (!network) {
                return handleErrorOneResponse({
                    code: "NOT FOUND",
                    message: "This network not found",
                    error: {},
                });
            };

            await this.vientaine_preRepository.delete({ district_id });

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete network success",
                data: {},
            });
        } catch (error: unknown) {
            logger.error({
                msg: "delete network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL SERVER ERROR",
                message: "an unexpected error accurred.",
                error: {},
            });
        };
    };

    static async deleteAllNetworks(): Promise<IOneResponse> {
        try {

            const network = await this.vientaine_preRepository.delete({});
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete all networks success",
                data: {network},
            });
        } catch (error: unknown) {
            logger.error({
                msg: "delete al network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };
};