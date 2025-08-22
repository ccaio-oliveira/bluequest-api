import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { ChallengesService, CreateChallengeDto } from "./challenges.service";
import { GetUser } from "src/common/decorators/get-user.decorator";

@ApiTags('challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('challenges')
export class ChallengesController {
    constructor(private readonly svc: ChallengesService) {}

    @Post()
    create(@GetUser() user: any, @Body() dto: CreateChallengeDto) {
        return this.svc.create(user.userId, dto);
    }

    @Get()
    listMine(@GetUser() user: any, @Query('mine') mine?: string) {
        if (mine === 'true') return this.svc.findMine(user.userId);
        return this.svc.findMine(user.userId);
    }

    @Patch(':id')
    update(@GetUser() user: any, @Param('id') id: string, @Body() patch: Partial<CreateChallengeDto>) {
        return this.svc.update(user.userId, id, patch);
    }
}