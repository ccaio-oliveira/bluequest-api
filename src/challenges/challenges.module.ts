import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Challenge } from "./entities/challenge.entity";
import { User } from "src/auth/entities/user.entity";
import { ChallengesService } from "./challenges.service";
import { ChallengesController } from "./challenges.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Challenge, User])],
    providers: [ChallengesService],
    controllers: [ChallengesController],
})
export class ChallengesModule {}