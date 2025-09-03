import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../modules/users/user.entity';
import { province } from '../modules/provinces/province.entity';
import { district } from '../modules/districts/district.entity';
import { village } from '../modules/villages/village.entity';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT ||'3306'),
    username: process.env.MYSQL_USERNAME ||'root',
    password: process.env.MYSQL_PASSWORD ||'Leepor@10072005',
    database: process.env.MYSQL_DATABASE ||'back_wardriving_2',
    synchronize: true, //use false in production
    logging: false,
    entities: [User, province, district, village],
});