import express, { Request, Response } from 'express';
import { AppDataSource } from '../database/dbConnect';
import { Vientaine_pre_network } from '../modules/vientaine_pre/vientaine_pre.entity';

const router = express.Router();

router.get("/wifis.geojson", async (req: Request, res: Response) => {
    try {
        const wifiRepository = AppDataSource.getRepository(Vientaine_pre_network);
        const { minLon, minLat, maxLon, maxLat, limit = 1000 } = req.query as any;

        let qb = Vientaine_pre_network
                .createQueryBuilder("wifi")
                .where("wifi.latitude IS NOT NULL")
                .andWhere("wifi.longitude IS NOT NULL");3

                //if have boundinng box must add filter
                if (minLon && minLat && maxLon && maxLat) {
                    qb = qb
                    .andWhere("wifi.latitude BeTWEEN :minLat AND :maxLat", {
                        minLat: parseFloat(minLat),
                        maxLat: parseFloat(maxLat),
                    })
                    .andWhere("wifi.lonitude BETWEEN :minLon AND :maxLon", {
                        minLon: parseFloat(minLon),
                        maxLon: parseFloat(maxLon),
                    });
                }
                
                //limit
                qb = qb.orderBy("wifi.captured_at", "DESC").limit(Number(limit));

                const rows = await qb.getMany();

                //translate to geojson
                const features = rows.map((r: any) =>({
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
                        coordinates: [Number(r.longitude), Number(r.latitude)],
                    },
                }));

                return res.json({
                    type: "FeatureCollection",
                    features,
                });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, reason: "db error" });
    }
});

export default router;