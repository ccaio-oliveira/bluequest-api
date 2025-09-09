import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsISO8601, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateChallengeDto {
    @ApiProperty({ maxLength: 140 })
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '2025-09-15T12:00:00Z' })
    @IsISO8601()
    startAtUTC!: string;

    @ApiProperty({ example: '2025-10-15T12:00:00Z' })
    @IsISO8601()
    endAtUTC!: string;

    @ApiProperty({
        description: 'Versioned rules envelope',
        example: {
            schema: 'challenge.rules',
            version: 1,
            timezonePolicy: 'user',
            graceMinutes: 0,
            windows: [{ start: '09:00', end: '22:00' }],
            recurrence: { type: 'weekly', rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' },
            points: { weekday: 10, weekend: 15 },
            requiresPhoto: true
        }
    })
    @IsObject()
    rulesJSON!: Record<string, any>;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isInviteOnly?: boolean = true;
}