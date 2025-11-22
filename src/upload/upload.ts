import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { parse } from "fast-csv";
import { AppDataSource } from "../database/dbConnect";
import { validateRow } from "./validator";
import { Vientaine_pre_network } from "../modules/vientaine_pre/vientaine_pre.entity";

const uploadRoute = express();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        cb(null, safe);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["text/csv", "application/vnd.ms-excel", "text/plain"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    }
});

// ---------------- ROUTE UPLOAD CSV ----------------
uploadRoute.post("/csv", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const results: any[] = [];
    const errors: string[] = [];

    let rowCount = 0;
    let invalidCount = 0;
    let responded = false;

    const stream = fs.createReadStream(filePath);

    const csvStream = parse({ headers: true, ignoreEmpty: true, trim: true })
        .validate((row, cb) => {
            rowCount++;

            const { ok, reason } = validateRow(row);
            if (!ok) {
                invalidCount++;
                errors.push(`Row ${rowCount}: ${reason}`);
            }

            cb(null, ok);
        })
        .on("error", (err) => {
            if (responded) return;
            responded = true;

            cleanup();
            return res.status(400).json({
                error: "CSV parse error",
                details: err.message,
            });
        })
        .on("data", (row) => {
            results.push({
                district_id: Number(row.district_id),
                user_id: Number(row.user_id),
                ssid: row.ssid,
                bssid: row.bssid,
                manufacturer: row.manufacturer,
                signal_strength: Number(row.signal_strength),
                authentication: row.authentication,
                encryption: row.encryption,
                radio_type: row.radio_type,
                channel: Number(row.channel),
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
                scan_timestamp: new Date(row.scan_timestamp),
                network_identifier: row.network_identifier,
                frequency: Number(row.frequency),
            });
        })
        .on("end", async () => {
            if (responded) return;

            const queryRunner = AppDataSource.createQueryRunner();

            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                if (results.length > 0) {
                    const entities = results.map((r) =>
                        queryRunner.manager.create(Vientaine_pre_network, r)
                    );

                    await queryRunner.manager.insert(Vientaine_pre_network, entities);
                }

                await queryRunner.commitTransaction();

                cleanup();
                responded = true;

                return res.json({
                    ok: true,
                    inserted: results.length,
                    invalid: invalidCount,
                    errors: errors.slice(0, 10),
                });

            } catch (err) {
                await queryRunner.rollbackTransaction();
                cleanup();

                if (!responded) {
                    responded = true;
                    return res.status(500).json({
                        error: "DB error",
                        details: (err as Error).message,
                    });
                }
            } finally {
                await queryRunner.release();
            }
        });

    stream.pipe(csvStream);

    function cleanup() {
        fs.unlink(filePath, (err) => {
            if (err) console.warn("Failed to delete file:", err.message);
        });
    }
});

export default uploadRoute;
