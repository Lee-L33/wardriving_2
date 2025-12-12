import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { parse } from "fast-csv";
import { AppDataSource } from "../database/dbConnect";
import { validateChanthabuly } from "./chanthabuly-validator";
import { Chanthabuly_network } from "../modules/chanthabuly/chanthabuly.entity";

const chanthabulyUploadRoute = express();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        cb(null, safe);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for large wardriving files
    fileFilter: (req, file, cb) => {
        const allowed = ["text/csv", "application/vnd.ms-excel", "text/plain"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    }
});

// CSV Upload Route
chanthabulyUploadRoute.post("/upload", upload.single("file"), async (req, res) => {
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

            const { ok, reason } = validateChanthabuly(row);
            if (!ok) {
                invalidCount++;
                if (errors.length < 100) { // Limit error collection
                    errors.push(`Row ${rowCount}: ${reason}`);
                }
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
            // Map CSV columns to database fields
            results.push({
                ssid: row.SSID || row.name || null,
                bssid: row.BSSID,
                manufacturer: row.MANUFACTURER || null,
                authentication: row.AUTHENTICATION || null,
                encryption: row.ENCRYPTION || null,
                radio_type: row["RADIO TYPE"] || null,
                channel: row.CHANNEL ? Number(row.CHANNEL) : null,
                frequency: row.frequency ? Number(row.frequency) : null,
                signal_strength: row.signal ? Number(row.signal) : null,
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
                first_seen: row["FIRST SEEN(UTC)"] ? new Date(row["FIRST SEEN(UTC)"]) : null,
                last_seen: row["LAST SEEN(UTC)"] ? new Date(row["LAST SEEN(UTC)"]) : null,
                network_type: row["NETWORK TYPE"] || null,
            });
        })
        .on("end", async () => {
            if (responded) return;

            const queryRunner = AppDataSource.createQueryRunner();

            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                if (results.length > 0) {
                    // Insert in batches to avoid memory issues
                    const batchSize = 500;
                    for (let i = 0; i < results.length; i += batchSize) {
                        const batch = results.slice(i, i + batchSize);
                        const entities = batch.map((r) =>
                            queryRunner.manager.create(Chanthabuly_network, r)
                        );

                        await queryRunner.manager.save(Chanthabuly_network, entities, {
                            chunk: 100 // Insert in chunks
                        });
                    }
                }

                await queryRunner.commitTransaction();

                cleanup();
                responded = true;

                return res.json({
                    ok: true,
                    inserted: results.length,
                    invalid: invalidCount,
                    total: rowCount,
                    errors: errors.slice(0, 20), // Return first 20 errors
                });

            } catch (err) {
                await queryRunner.rollbackTransaction();
                cleanup();

                if (!responded) {
                    responded = true;
                    return res.status(500).json({
                        error: "Database error",
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

export default chanthabulyUploadRoute;
