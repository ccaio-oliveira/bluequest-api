import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class InitUserAndChallenge1710000000000 implements MigrationInterface {
    name = 'InitUserAndChallenge1710000000000';

    public async up(q: QueryRunner): Promise<void> {
        await q.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'char', length: '36', isPrimary: true },
                { name: 'email', type: 'varchar', length: '255', isUnique: true, isNullable: false },
                { name: 'passwordHash', type: 'varchar', length: '255', isNullable: false },
                { name: 'displayName', type: 'varchar', length: '120', isNullable: false },
                { name: 'timezone', type: 'varchar', length: '64', isNullable: false, default: `'UTC'` },
                { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
            ],
            engine: 'InnoDB',
        }));

        await q.createIndex('users', new TableIndex({ name: 'idx_users_email', columnNames: ['email'] }));

        await q.createTable(new Table({
            name: 'challenges',
            columns: [
                { name: 'id', type: 'char', length: '36', isPrimary: true },
                { name: 'ownerId', type: 'char', length: '36', isNullable: false },
                { name: 'title', type: 'varchar', length: '140', isNullable: false },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'startAtUTC', type: 'datetime', isNullable: false },
                { name: 'endAtUTC', type: 'datetime', isNullable: false },
                { name: 'rulesJSON', type: 'json', isNullable: false },
                { name: 'isInviteOnly', type: 'tinyint', width: 1, default: '1', isNullable: false },
                { name: 'createdAt', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
            ],
            engine: 'InnoDB',
        }));

        await q.createForeignKey('challenges', new TableForeignKey({
            name: 'fk_ch_owner',
            columnNames: ['ownerId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        }));
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.dropForeignKey('challenges', 'fk_ch_owner');
        await q.dropTable('challenges');
        await q.dropIndex('users', 'idx_users_email');
        await q.dropTable('users');
    }
}
