import express from 'express';
import { AppDataSource } from './database/dbConnect';
import dotenv from 'dotenv';
import userRoute from './modules/users/routes';
import provinceRoute from './modules/provinces/routes';
dotenv.config();

const startServer = async () => {
    const app = express();
    const PORT = Number(process.env.SERVER_PORT);

    app.use(express.json()); 
    
    //Users routes
    app.use('/api/users', userRoute);
    app.use('/api/provinces', provinceRoute);
    
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