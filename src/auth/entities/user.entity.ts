import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid') id!: string;

    @Index('idx_users_email', { unique: true })
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 }) passwordHash!: string;

    @Column({ type: 'varchar', length: 120 }) displayName!: string;

    @Column({ type: 'varchar', length: 64, default: 'UTC' }) timezone!: string;

    @CreateDateColumn() createdAt!: Date;
}