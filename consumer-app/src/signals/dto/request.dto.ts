import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetSignalsDto {
  @ApiPropertyOptional({ description: 'Filter by deviceId', example: 'abc123' })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
