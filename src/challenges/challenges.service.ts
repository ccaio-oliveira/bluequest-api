import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Challenge } from "./entities/challenge.entity";
import { Repository } from "typeorm";
import { User } from "src/auth/entities/user.entity";

export interface CreateChallengeDto {
    title: string; description?: string;
    startAtUTC: string; endAtUTC: string;
    rulesJSON: Record<string, any>;
    isInviteOnly?: boolean;
}

@Injectable()
export class ChallengesService {
    constructor(
        @InjectRepository(Challenge) private readonly repo: Repository<Challenge>,
        @InjectRepository(User) private readonly users: Repository<User>,
    ) {}

    async create(ownerId: string, dto: CreateChallengeDto) {
        const owner = await this.users.findOneByOrFail({ id: ownerId });
        const c = this.repo.create({
            owner,
            title: dto.title,
            description: dto.description,
            startAtUTC: new Date(dto.startAtUTC),
            endAtUTC: new Date(dto.endAtUTC),
            rulesJSON: dto.rulesJSON,
            isInviteOnly: dto.isInviteOnly ?? true,
        });

        return this.repo.save(c);
    }

    async findMine(userId: string) {
        const user = await this.repo.createQueryBuilder('c')
        .leftJoinAndSelect('c.owner', 'owner')
        .where('owner.id = :userId', { userId })
        .orderBy('c.createdAt', 'DESC')
        .getMany();

        return user;
    }

    async update(ownerId: string, id: string, patch: Partial<CreateChallengeDto>) {
        const c = await this.repo.findOne({ where: { id }, relations: ['owner'] });
        if (!c || c.owner.id !== ownerId) throw new ForbiddenException('NOT_OWNER');
        if (new Date() > new Date(c.endAtUTC)) throw new ForbiddenException('PAST_END');
        Object.assign(c, patch);
        return this.repo.save(c);
    }
}