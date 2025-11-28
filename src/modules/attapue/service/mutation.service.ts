import { AppDataSource } from "../../../database/dbConnect";
import logger from "../../../middlewares/logger";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import { Attapue_network } from "../attapue.entity";

export class MutationServices {
    static attapueRepository = AppDataSource.getRepository(Attapue_network);

    static async createNetwork(data: Attapue_network): Promise<IOneResponse> {
        try {
            // Validate district_id
            const district_id = Number(data.district_id);
            if (!district_id) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "District not found",
                    error: {},
                });
            }

            // Validate Required Fields
            const requiredFields: (keyof Attapue_network)[] = [
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
                const value = data[field];

                if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
                    return handleErrorOneResponse({
                        code: "DATA_REQUIRED",
                        message: `${field} is required`,
                        error: {},
                    });
                }
            }

            // Prevent Duplicate BSSID
            // Lowercase normalize to ensure consistency
            const normalizedBssid = data.bssid.toLowerCase();
            const existing = await this.attapueRepository.findOneBy({ bssid: normalizedBssid });

            if (existing) {
                return handleErrorOneResponse({
                    code: "DUPLICATE",
                    message: "This BSSID already exists",
                    error: {},
                });
            }

            data.bssid = normalizedBssid;

            // Save Network
            const network = await this.attapueRepository.save(data);

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Create attapue_network success",
                data: { network }
            });

        } catch (error: unknown) {
            logger.error({
                msg: "createNetwork error",
                error: error instanceof Error ? error : new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurs.",
                error: {},
            });
        };
    };

    static async updateNetwork(id: number, data: Attapue_network): Promise<IOneResponse> {
        try {
            
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Update network success",
                data: {},
            });
        } catch (error: unknown) {
            logger.error({
                msg: "update network error",
                error: error instanceof Error ? error: new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL SERVER ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        };
    };

    static async deleteNetwork(id: number): Promise<IOneResponse> {
        try {

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Delete network success",
                data: {},
            });
        } catch (error: unknown) {
            logger.error({
                msg: "delete network error",
                error: error instanceof Error ? error: new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL SERVER ERROR",
                message: "an unexpected error accurred.",
                error: {},
            });
        };
    };
};