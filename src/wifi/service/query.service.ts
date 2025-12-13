import { AppDataSource } from "../../database/dbConnect";
import logger from "../../middlewares/logger";
import { IManyResponse, IOneResponse } from "../../types/base";
import { handleErrorManyResponse, handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../utils";
import { WifiNetwork } from "../wifi.entity";
import { Like } from "typeorm";

export class QueryServices {
    static wifiRepository = AppDataSource.getRepository(WifiNetwork);

    static async getNetwork(id: number): Promise<IOneResponse> {
        try {
            // Check id
            if (!id) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "Missing id",
                    error: {},
                });
            }

            // Get network from id
            const network = await this.wifiRepository.findOneBy({ id });
            if (!network) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "WiFi network not found",
                    error: {},
                });
            }

            // Return to client
            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Get one network success",
                data: { network },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "get network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        }
    }

    static async getAllNetworks(filters?: {
        district?: string;
        authentication?: string;
        encryption?: string;
        limit?: number;
        offset?: number;
    }): Promise<IManyResponse> {
        try {
            const whereConditions: any = {};

            // Apply filters
            if (filters?.district) {
                whereConditions.district = filters.district;
            }
            if (filters?.authentication) {
                whereConditions.authentication = filters.authentication;
            }
            if (filters?.encryption) {
                whereConditions.encryption = filters.encryption;
            }

            // Count total networks
            const totalNetworks = await this.wifiRepository.count({ where: whereConditions });

            // Get networks data with pagination
            const networks = await this.wifiRepository.find({
                where: whereConditions,
                take: filters?.limit || 100,
                skip: filters?.offset || 0,
                order: {
                    created_at: "DESC"
                }
            });

            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: "Get all networks success",
                total: totalNetworks,
                data: { networks },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "get all network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorManyResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: 'An unexpected error occurred.',
                error: {},
            });
        }
    }

    static async getNetworksByDistrict(district: string): Promise<IManyResponse> {
        try {
            if (!district) {
                return handleErrorManyResponse({
                    code: "BAD_REQUEST",
                    message: "District is required",
                    error: {},
                });
            }

            // Count total networks in district
            const totalNetworks = await this.wifiRepository.count({ where: { district } });

            // Get networks data
            const networks = await this.wifiRepository.find({
                where: { district },
                order: {
                    created_at: "DESC"
                }
            });

            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: `Get networks for district ${district} success`,
                total: totalNetworks,
                data: { networks },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "get networks by district error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorManyResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: 'An unexpected error occurred.',
                error: {},
            });
        }
    }

    static async getNetworkByBSSID(bssid: string): Promise<IOneResponse> {
        try {
            if (!bssid) {
                return handleErrorOneResponse({
                    code: "BAD_REQUEST",
                    message: "BSSID is required",
                    error: {},
                });
            }

            const normalizedBssid = bssid.toLowerCase();
            const network = await this.wifiRepository.findOneBy({ bssid: normalizedBssid });

            if (!network) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND",
                    message: "Network not found",
                    error: {},
                });
            }

            return handleSuccessOneResponse({
                code: "SUCCESS",
                message: "Get network by BSSID success",
                data: { network },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "get network by BSSID error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred.",
                error: {},
            });
        }
    }

    static async searchNetworks(query: string): Promise<IManyResponse> {
        try {
            if (!query) {
                return handleErrorManyResponse({
                    code: "BAD_REQUEST",
                    message: "Search query is required",
                    error: {},
                });
            }

            // Search by SSID or manufacturer
            const networks = await this.wifiRepository.find({
                where: [
                    { ssid: Like(`%${query}%`) },
                    { manufacturer: Like(`%${query}%`) }
                ],
                order: {
                    created_at: "DESC"
                }
            });

            return handleSuccessManyResponse({
                code: "SUCCESS",
                message: "Search networks success",
                total: networks.length,
                data: { networks },
            });
        } catch (error: unknown) {
            logger.error({
                msg: "search networks error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorManyResponse({
                code: "INTERNAL_SERVER_ERROR",
                message: 'An unexpected error occurred.',
                error: {},
            });
        }
    }
}
