import express, { Request, Response } from "express";
import { AppDataSource } from "../database/dbConnect";
import { Vientaine_pre_network } from "../modules/vientaine_pre/vientaine_pre.entity";

const router = express.Router();

router.get("/wifis.geojson", async (req: Request, res: Response) => {
    try {
        const wifiRepository = AppDataSource.getRepository(Vientaine_pre_network);

        const { minLon, minLat, maxLon, maxLat } = req.query as any;
        const limit = Number(req.query.limit) || 1000;

        // QueryBuilder
        let qb = wifiRepository
            .createQueryBuilder("wifi")
            .where("wifi.latitude IS NOT NULL")
            .andWhere("wifi.longitude IS NOT NULL");

        // ถ้ามี bounding box ให้ filter
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

        // Limit + order
        qb = qb.orderBy("wifi.captured_at", "DESC").limit(limit);

        const rows = await qb.getMany();

        // Convert to GeoJSON
        const features = rows.map((r: any) => ({
            type: "Feature",
            properties: {
                id: r.id,
                ssid: r.ssid,
                bssid: r.bssid,
                rssi: r.rssi,
                channel: r.channel,
                manufacturer: r.manufacturer,
                captured_at: r.captured_at,
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
        });

    } catch (error) {
        console.error("Error in /wifis.geojson:", error);
        return res.status(500).json({ ok: false, reason: "db error" });
    }
});

export default router;
