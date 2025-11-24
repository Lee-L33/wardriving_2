import { AppDataSource } from "../../../database/dbConnect";
import logger from "../../../middlewares/logger";
import { IManyResponse, IOneResponse } from "../../../types/base";
import { handleErrorManyResponse, handleErrorOneResponse, handleSuccessManyResponse, handleSuccessOneResponse } from "../../../utils";
import { Vientaine_pre_network } from "../vientaine_pre.entity";

export class QueryServices {
    static vientaine_pre_networkRepository = AppDataSource.getRepository(Vientaine_pre_network);

    static async get_network(district_id: number): Promise<IOneResponse> {
        try {
            //Read district_id from params
            const id = district_id;

            //Check district_id
            if (!id) {
                return handleErrorOneResponse ({
                    code: "BAD_REQUEST",
                    message: "Missing id",
                    error: {},
                });
            }
            
            //Get network from district_id
            const network = await this.vientaine_pre_networkRepository.findOneBy({ district_id: id});
            if (!network) {
                return handleErrorOneResponse ({
                    code: "NOT FOUND",
                    message: "vientaine_pre_network not found",
                    error: {},
                });
            };

            //Return to client
            return handleSuccessOneResponse ({
                code: "SUCCESS",
                message: "Get one network success",
                data: {network},
            })
        } catch (error: unknown) {
            logger.error ({
                msg: "get network error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorOneResponse ({
                code: "INTERNAL SERVER ERROR",
                message: "AN unexpected error occurres.",
                error: {},
            });
        };
    };

    static async getAll_network(): Promise<IManyResponse> {
        try {
            //Count total networks
            const totalNetworks = await this.vientaine_pre_networkRepository.count({});

            //Get networks data
            const netwoks = await this.vientaine_pre_networkRepository.find({});

            return handleSuccessManyResponse ({
                 code: "SUCCESS",
                 message: "Get all networks success",
                 total: totalNetworks,
                 data: {netwoks},
            });
        } catch (error: unknown) {
            logger.error ({
                msg: "get all netwok error",
                error: error instanceof Error ? error : new Error(String(error)),
            });
            return handleErrorManyResponse ({
                code: "INTERNAL SERVER ERROR",
                message: 'An unexpected error occurres.',
                error: {},
            });
        };
    };
};