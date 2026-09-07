import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto } from './dto/create-escrow.dto';
import { UpdateEscrowDto } from './dto/update-escrow.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';

@ApiTags('Escrow')
@Controller('escrow')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post()
  @ApiOperation({ summary: 'Create new escrow' })
  @ApiResponse({ status: 201, description: 'Escrow created successfully' })
  create(@Request() req, @Body() createEscrowDto: CreateEscrowDto) {
    return this.escrowService.create(req.user.id, createEscrowDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user escrows' })
  @ApiResponse({ status: 200, description: 'Escrows retrieved successfully' })
  findAll(
    @Request() req,
    @Query('page', new PositiveIntPipe(1)) page: number,
    @Query('limit', new PositiveIntPipe(20, 100)) limit: number,
  ) {
    return this.escrowService.findUserEscrows(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get escrow by ID' })
  @ApiResponse({ status: 200, description: 'Escrow retrieved successfully' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.escrowService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update escrow' })
  @ApiResponse({ status: 200, description: 'Escrow updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateEscrowDto: UpdateEscrowDto,
    @Request() req,
  ) {
    return this.escrowService.update(id, updateEscrowDto, req.user.id);
  }

  @Post(':id/fund')
  @ApiOperation({ summary: 'Fund escrow' })
  @ApiResponse({ status: 200, description: 'Escrow funded successfully' })
  fund(@Param('id') id: string, @Request() req) {
    return this.escrowService.fundEscrow(id, req.user.id);
  }

  @Post(':id/release')
  @ApiOperation({ summary: 'Release escrow funds' })
  @ApiResponse({ status: 200, description: 'Escrow funds released successfully' })
  release(@Param('id') id: string, @Request() req) {
    return this.escrowService.releaseEscrow(id, req.user.id);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Dispute escrow' })
  @ApiResponse({ status: 200, description: 'Escrow disputed successfully' })
  dispute(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.escrowService.disputeEscrow(id, body.reason, req.user.id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept escrow invitation' })
  @ApiResponse({ status: 200, description: 'Escrow invitation accepted' })
  acceptInvitation(@Param('id') id: string, @Request() req) {
    return this.escrowService.acceptInvitation(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel escrow' })
  @ApiResponse({ status: 200, description: 'Escrow cancelled successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.escrowService.cancel(id, req.user.id);
  }
}