import { plainToInstance } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";

enum NodeEnv { development='development', production='production', test='test' }

class EnvVars {
    @IsEnum(NodeEnv)
    NODE_ENV!: NodeEnv;

    @IsInt()
    PORT!: number;


    @IsString() @IsNotEmpty()
    JWT_ACCESS_SECRET!: string;


    @IsString() @IsNotEmpty()
    JWT_REFRESH_SECRET!: string;


    @IsInt() JWT_ACCESS_TTL!: number;
    @IsInt() JWT_REFRESH_TTL!: number;


    @IsString() DB_HOST!: string;
    @IsInt() DB_PORT!: number;
    @IsString() DB_USER!: string;
    @IsString() DB_PASS!: string;
    @IsString() DB_NAME!: string;


    @IsString() @IsOptional() REDIS_HOST?: string;
}

export function validateEnv(config: Record<string, unknown>) {
    const validated = plainToInstance(EnvVars, config, { enableImplicitConversion: true });
    const errors = validateSync(validated, { skipMissingProperties: false });
    if (errors.length) throw new Error(errors.toString());
    return validated;
}