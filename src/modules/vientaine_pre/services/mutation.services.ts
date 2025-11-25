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
            const existing = await this.vientaine_preRepository.findOne({
                where: { bssid: data.bssid }
            });

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
};