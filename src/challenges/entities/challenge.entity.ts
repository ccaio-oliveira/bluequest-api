import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('challenges')
export class Challenge {
    @PrimaryGeneratedColumn('uuid') id!: string;

    @ManyToOne(() => User, { eager: true })
    owner!: User;

    @Column({ type: 'varchar', length: 140 }) title!: string;
    @Column({ type: 'text', nullable: true }) description?: string;

    @Column({ type: 'datetime' }) startAtUTC!: Date;
    @Column({ type: 'datetime' }) endAtUTC!: Date;

    @Column({ type: 'json' }) rulesJSON!: Record<string, any>;
    @Column({ type: 'boolean', default: true }) isInviteOnly!: boolean;

    @CreateDateColumn() createdAt!: Date;
}