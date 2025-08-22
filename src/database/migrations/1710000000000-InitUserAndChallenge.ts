import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUserAndChallenge1710000000000 implements MigrationInterface {
    name = 'InitUserAndChallenge1710000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id char(36) PRIMARY KEY,
                email varchar(255) NOT NULL UNIQUE,
                passwordHash varchar(255) NOT NULL,
                timezone varchar(64) NOT NULL DEFAULT 'UTC',
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await queryRunner.query(`
            CREATE TABLE challenges (
                id char(36) PRIMARY KEY,
                ownerId char(36) NOT NULL,
                title varchar(140) NOT NULL,
                description text NULL,
                startAtUTC datetime NOT NULL,
                endAtUTC datetime NOT NULL,
                rulesJSON json NOT NULL,
                isInviteOnly boolean NOT NULL DEFAULT true,
                createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                CONSTRAINT fk_ch_owner FOREIGN KEY (ownerId) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS challenges');
        await queryRunner.query('DROP TABLE IF EXISTS users');
    }
}