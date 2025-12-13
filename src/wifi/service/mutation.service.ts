import { AppDataSource } from "../../database/dbConnect";
import logger from "../../middlewares/logger";
import { IOneResponse } from "../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../utils";
import { WifiNetwork } from "../wifi.entity";

export class MutationServices {
    static wifiRepository = AppDataSource.getRepository(WifiNetwork);

    static async createNetwork(data: WifiNetwork): Promise<IOneResponse> {
        try {
            // Validate Required Fields
            const requiredFields: (keyof WifiNetwork)[] = [
                "bssid",
                "latitude",
                "longitude"
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
            const existing = await this.wifiRepository.findOneBy({ bssid: normalizedBssid });

            if (existing) {
                return handleErrorOneResponse({
                    code: "DUPLICATE",
                    message: "This BSSID already exists",
                    error: {},
                });
            }

            data.bssid = normalizedBssid;

            // Save Network
            const network = await this.wifiRepository.save(data);

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Create wifi network success",
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
        }
    }

    static async updateNetwork(id: number, data: Partial<WifiNetwork>): Promise<IOneResponse> {
        try {
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing network id",
                    error: {},
                });
            }

            // Check if network exists
            const network = await this.wifiRepository.findOneBy({ id });
            if (!network) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "Network not found",
                    error: {},
                });
            }

            // If BSSID is being updated, check for duplicates
            if (data.bssid && data.bssid !== network.bssid) {
                const normalizedBssid = data.bssid.toLowerCase();
                const existing = await this.wifiRepository.findOneBy({ bssid: normalizedBssid });

                if (existing && existing.id !== id) {
                    return handleErrorOneResponse({
                        code: "DUPLICATE",
                        message: "This BSSID already exists",
                        error: {},
                    });
                }

                data.bssid = normalizedBssid;
            }

            // Update network
            await this.wifiRepository.update(id, data);

            // Fetch updated network
            const updatedNetwork = await this.wifiRepository.findOneBy({ id });

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Update network success",
                data: { network: updatedNetwork },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "update network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        }
    }

    static async deleteNetwork(id: number): Promise<IOneResponse> {
        try {
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing network id",
                    error: {},
                });
            }

            const network = await this.wifiRepository.findOneBy({ id });
            if (!network) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "Network not found",
                    error: {},
                });
            }

            await this.wifiRepository.delete({ id });

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
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        }
    }

    static async bulkCreateNetworks(dataArray: WifiNetwork[]): Promise<IOneResponse> {
        try {
            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Data array is required and must not be empty",
                    error: {},
                });
            }

            const created: WifiNetwork[] = [];
            const skipped: { bssid: string; reason: string }[] = [];

            for (const data of dataArray) {
                // Validate required fields
                if (!data.bssid || !data.latitude || !data.longitude) {
                    skipped.push({
                        bssid: data.bssid || "unknown",
                        reason: "Missing required fields (bssid, latitude, longitude)"
                    });
                    continue;
                }

                // Check for duplicate BSSID
                const normalizedBssid = data.bssid.toLowerCase();
                const existing = await this.wifiRepository.findOneBy({ bssid: normalizedBssid });

                if (existing) {
                    skipped.push({
                        bssid: normalizedBssid,
                        reason: "BSSID already exists"
                    });
                    continue;
                }

                data.bssid = normalizedBssid;

                // Save network
                const network = await this.wifiRepository.save(data);
                created.push(network);
            }

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: `Bulk create completed. Created: ${created.length}, Skipped: ${skipped.length}`,
                data: {
                    created: created.length,
                    skipped: skipped.length,
                    networks: created,
                    skippedDetails: skipped
                }
            });

        } catch (error: unknown) {
            logger.error({
                msg: "bulkCreateNetworks error",
                error: error instanceof Error ? error : new Error(String(error)),
            });

            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurs.",
                error: {},
            });
        }
    }
}
