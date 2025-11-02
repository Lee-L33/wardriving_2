import { AppDataSource } from "../../../database/dbConnect";
import logger from "../../../middlewares/logger";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import { Vientaine_pre_network } from "../vientaine_pre.entity";


export class MutationServices {
    static attapue_networkRepository = AppDataSource.getRepository(Vientaine_pre_network);

    static async createNetwork(data: Vientaine_pre_network): Promise<IOneResponse> {
        try {
            const district_id = Number;
            if (!district_id) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND", message: "District not found", error: {},
                });
            };
            if (!data.ssid) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Ssid must required", error: {},
                });
            };
            if (!data.bssid) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Bssid must required", error: {},
                });
            };
            if (!data.manufacturer) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "manufaacturer must required", error: {},
                });
            };
            if (!data.signal_strength) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Signal_strength must required", error: {},
                });
            };
            if (!data.authentication) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Authentication must required", error: {},
                });
            };
            if (!data.encryption) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Encryption must required", error: {},
                });
            };
            if (!data.radio_type) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Radio_type must required", error: {},
                });
            };
            if (!data.channel) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Channel must required", error: {},
                });
            };
            if (!data.latitude) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Latitude must required", error: {},
                });
            };
            if (!data.longitude) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Longtitude must required", error: {},
                });
            };
            if (!data.scan_timestamp) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Scan_timestamp must required", error: {},
                });
            };
            if (!data.network_identifier) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Network_indetifier must required", error: {},
                });
            };
            if (!data.frequency) {
                return handleErrorOneResponse({ 
                    code: "DATA_REQUIRED", message: "Frequency must required", error: {},
                });
            };

            const createNetwork = await this.attapue_networkRepository.save(data);

            return handleSuccessOneResponse({
                code: "SUCCESS", message: "Create attapue_network sucsess", data: {createNetwork},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "createNetwork error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse ({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurres.",
                error: {},
            });
        };
    };
};