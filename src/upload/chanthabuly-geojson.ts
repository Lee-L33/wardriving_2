import express, { Request, Response } from "express";
import { AppDataSource } from "../database/dbConnect";
import { Chanthabuly_network } from "../modules/chanthabuly/chanthabuly.entity";

const chanthabulyGeoJsonRoute = express();

chanthabulyGeoJsonRoute.get("/geojson", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Chanthabuly_network);

        const { minLon, minLat, maxLon, maxLat } = req.query as any;
        const limit = Number(req.query.limit) || 5000;

        // Build query
        let qb = repository
            .createQueryBuilder("wifi")
            .where("wifi.latitude IS NOT NULL")
            .andWhere("wifi.longitude IS NOT NULL")
            .andWhere("wifi.latitude != 0.0")
            .andWhere("wifi.longitude != 0.0");

        // Apply bounding box filter if provided
        if (minLon && minLat && maxLon && maxLat) {
            const minLatF = parseFloat(minLat);
            const maxLatF = parseFloat(maxLat);
            const minLonF = parseFloat(minLon);
            const maxLonF = parseFloat(maxLon);

            if (
                isFinite(minLatF) && isFinite(maxLatF) &&
                isFinite(minLonF) && isFinite(maxLonF)
            ) {
                qb = qb
                    .andWhere("wifi.latitude BETWEEN :minLat AND :maxLat", {
                        minLat: minLatF,
                        maxLat: maxLatF,
                    })
                    .andWhere("wifi.longitude BETWEEN :minLon AND :maxLon", {
                        minLon: minLonF,
                        maxLon: maxLonF,
                    });
            }
        }

        // Order by signal strength (strongest first) and limit
        qb = qb
            .orderBy("wifi.signal_strength", "DESC")
            .limit(limit);

        const rows = await qb.getMany();

        // Convert to GeoJSON FeatureCollection
        const features = rows.map((r: any) => ({
            type: "Feature",
            properties: {
                id: r.id,
                ssid: r.ssid,
                bssid: r.bssid,
                manufacturer: r.manufacturer,
                signal_strength: r.signal_strength,
                authentication: r.authentication,
                encryption: r.encryption,
                channel: r.channel,
                frequency: r.frequency,
                radio_type: r.radio_type,
                network_type: r.network_type,
                first_seen: r.first_seen,
                last_seen: r.last_seen,
            },
            geometry: {
                type: "Point",
                coordinates: [
                    Number(r.longitude),
                    Number(r.latitude)
                ],
            },
        }));

        return res.json({
            type: "FeatureCollection",
            features,
            metadata: {
                count: features.length,
                limit: limit,
            }
        });

    } catch (error) {
        console.error("Error in /chanthabuly/geojson:", error);
        return res.status(500).json({
            ok: false,
            reason: "Database error",
            details: (error as Error).message
        });
    }
});

export default chanthabulyGeoJsonRoute;
