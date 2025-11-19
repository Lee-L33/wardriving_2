import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { parse } from 'fast-csv';
import { AppDataSource } from '../database/dbConnect';
import { validateRow } from './validator';
import { District } from '../modules/districts/district.entity';
import { User } from '../modules/users/user.entity';

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, safe);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB
    fileFilter: (req, file, cb) => {
        const allowed = ["text/csv", "application/vnd.ms-ecxel", "text/plain"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only CSV files are allowed"));
        }
        cb(null, true);
    }
});

//POST /api/upload/csv
router.post("/csv", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const results: any[] = [];
    let rowCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];

    //stream parse
    const stream = fs.createReadStream(filePath);

    const csvStream = parse({ headers: true, ignoreEmpty: true, trim: true })
        .validate((row: any, cb) => {
            //validate headers and fields
            const { ok, reason } = validateRow(row);
            if (!ok) {
                invalidCount++;
                errors.push(`Row ${rowCount + 1}: ${reason}`);
            }
            cb(null, ok);
        })
        .on("error", err => {
            console.error("CSV parse error:", err);
            cleanup();
            return res.status(400).json({ error: "CSV parse error", details: err.message });
        })
        .on("data", (row: any) => {
            rowCount++;
            //transform row if needed
            results.push(row);
        })
        .on("end", async (rowCountParsed: number) => {
            const queryRunner = AppDataSource.createQueryRunner();

            try {
                await queryRunner.connect();
                await queryRunner.startTransaction();

                if (results.length > 0) {
                    // เตรียมข้อมูลในรูปแบบ entity
                    const entities = results.map((r) => {
                        return queryRunner.manager.create(User, {
                            username: r.username,
                            email: r.email,
                            password: r.password,
                        });
                    });

                    // insert แบบ bulk ที่เร็วกว่า save()
                    await queryRunner.manager.insert(User, entities);
                }

                await queryRunner.commitTransaction();

                cleanup();
                return res.json({
                    ok: true,
                    inserted: results.length,
                    invalid: invalidCount,
                    errors: errors.slice(0, 10)
                });

            } catch (err) {
                await queryRunner.rollbackTransaction();
                console.error("DB insert error:", err);
                cleanup();

                return res.status(500).json({
                    error: "DB error",
                    details: (err as Error).message
                });

            } finally {
                await queryRunner.release();
            }
        });


    stream.pipe(csvStream);

    function cleanup() {
        //delete temp file
        fs.unlink(filePath, err => {
            if (err) console.warn("Failed to remove upload:", err.message);
        });
    }
});

export default router;