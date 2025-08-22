import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly jwt: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const exists = await this.users.findOne({ where: { email: dto.email } });
        
        if (exists) throw new ConflictException('EMAIL_TAKEN');
        
        const user = this.users.create({
            email: dto.email,
            passwordHash: await argon2.hash(dto.password),
            displayName: dto.displayName,
            timezone: dto.timezone || 'UTC',
        });

        await this.users.save(user);
        
        const tokens = await this.issueTokens(user.id);

        return { user: this.sanitize(user), ...tokens };
    }

    async login(email: string, password: string) {
        const user = await this.users.findOne({ where: { email } });

        if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

        const ok = await argon2.verify(user.passwordHash, password);

        if (!ok) throw new UnauthorizedException('INVALID_CREDENTIALS');

        const tokens = await this.issueTokens(user.id);

        return { user: this.sanitize(user), ...tokens };
    }

    async refresh(userId: string) {
        const tokesn = await this.issueTokens;
        return tokesn;
    }

    private async issueTokens(userId: string) {
        const access = await this.jwt.signAsync(
            { sub: userId },
            { secret: process.env.JWT_ACCESS_SECRET!, expiresIn: Number(process.env.JWT_ACCESS_TTL || 900) },
        );

        const refresh = await this.jwt.signAsync(
            { sub: userId, type: 'refresh' },
            { secret: process.env.JWT_REFRESH_SECRET!, expiresIn: Number(process.env.JWT_REFRESH_TTL || 2592000) },
        );

        return { accessToken: access, refreshToken: refresh };
    }

    private sanitize(u: User) {
        const { passwordHash, ...rest } = u as any;
        return rest;
    }
}