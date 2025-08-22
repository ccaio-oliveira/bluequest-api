import { User } from "src/auth/entities/user.entity";
import { Challenge } from "src/challenges/entities/challenge.entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Challenge],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
    charset: 'utf8mb4',
})