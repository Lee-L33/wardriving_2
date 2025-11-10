import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

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