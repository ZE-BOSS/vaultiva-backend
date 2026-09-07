import { PartialType } from '@nestjs/swagger';
import { CreateEscrowDto } from './create-escrow.dto';

export class UpdateEscrowDto extends PartialType(CreateEscrowDto) {}