import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EscrowType, EscrowMode } from '../entities/escrow.entity';
import { ParticipantRole } from '../entities/escrow-participant.entity';

export class CreateEscrowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ enum: EscrowType })
  @IsEnum(EscrowType)
  type: EscrowType;

  @ApiProperty({ enum: EscrowMode })
  @IsEnum(EscrowMode)
  mode: EscrowMode;

  @ApiProperty()
  @IsDateString()
  releaseDate: string;

  @ApiProperty({ type: [Object] })
  @IsArray()
  participants: Array<{
    userId: string;
    role: ParticipantRole;
    contributionAmount?: number;
  }>;

  @ApiProperty({ required: false })
  @IsOptional()
  conditions?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}