import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RefreshDto } from "./dtos/refresh.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const register = await this.auth.register(dto);
        return register;
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: RegisterDto) {
        const login = await this.auth.login(dto.email, dto.password);
        return login;
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body() _dto: RefreshDto) {
        const userId = await this.auth.refresh((arguments as any)[0].user.userId);
        return userId;
    }
}