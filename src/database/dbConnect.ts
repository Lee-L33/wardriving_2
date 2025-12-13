import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../modules/users/user.entity';
import { Province } from '../modules/provinces/province.entity';
import { District } from '../modules/districts/district.entity';
import { Village } from '../modules/villages/village.entity';
import { Attapue_network } from '../modules/attapue/attapue.entity';
import { Vientaine_pre_network } from '../modules/vientaine_pre/vientaine_pre.entity';
import { Chanthabuly_network } from '../modules/chanthabuly/chanthabuly.entity';
import { WifiNetwork } from '../wifi/wifi.entity';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
    synchronize: true, //use false in production
    logging: false,
    entities: [
        User, Province, District, Village, Attapue_network, Vientaine_pre_network, Chanthabuly_network, WifiNetwork
    ],
});