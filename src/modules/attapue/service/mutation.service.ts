import { AppDataSource } from "../../../database/dbConnect";
import logger from "../../../middlewares/logger";
import { IOneResponse } from "../../../types/base";
import { handleErrorOneResponse, handleSuccessOneResponse } from "../../../utils";
import { Attapue_network } from "../attapue.entity";


export class MutationServices {
    static attapueRepository = AppDataSource.getRepository(Attapue_network);

    static async createNetwork(data: Attapue_network): Promise<IOneResponse> {
        try {
            //Validate distrcit id
            const district_id = Number;
            if (!district_id) {
                return handleErrorOneResponse({
                    code: "NOT_FOUND", 
                    message: "District not found", 
                    error: {},
                });
            };
            
            //Required fileds
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
                if (data[field] === undefined || data[field] === null || data[field] === "") {
                    return handleErrorOneResponse({
                        code: "DATA_REQUIRED",
                        message: `${field} is required`,
                        error: {},
                    });
                };
            };

            //Prevent duplicate BSSID
            const existing = await this.attapueRepository.findOneBy({ bssid: data.bssid});
            if (existing) {
                return handleErrorOneResponse({
                    code: "DUPLICATE",
                    message: "This bssid already exists",
                    error: {},
                });
            };

            //save the network
            const createNetwork = await this.attapueRepository.save(data);

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