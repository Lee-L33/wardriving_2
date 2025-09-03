import express, { Request, Response } from 'express';
// import dotenv from 'dotenv';
import { AppDataSource } from './database/dbConnect';
// dotenv.config();

const startServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 8800;

    app.use(express.json()); 
    
    console.log('hello world');

    AppDataSource.initialize()
    .then(() => {
        console.log("Connected database successful");

        const server = app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

        server.on('error', (err: Error) => {
            console.log('Failed to start server:', err);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

};

startServer();