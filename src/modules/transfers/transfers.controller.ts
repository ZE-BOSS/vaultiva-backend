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
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateScheduledTransferDto } from './dto/create-scheduled-transfer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';

@ApiTags('Transfers')
@Controller('transfers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @ApiOperation({ summary: 'Create transfer' })
  @ApiResponse({ status: 201, description: 'Transfer created successfully' })
  create(@Request() req, @Body() createTransferDto: CreateTransferDto) {
    return this.transfersService.createTransfer(req.user.id, createTransferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user transfers' })
  @ApiResponse({ status: 200, description: 'Transfers retrieved successfully' })
  findAll(
    @Request() req,
    @Query('page', new PositiveIntPipe(1)) page: number,
    @Query('limit', new PositiveIntPipe(20, 100)) limit: number,
  ) {
    return this.transfersService.getUserTransfers(req.user.id, page, limit);
  }

  @Post('scheduled')
  @ApiOperation({ summary: 'Create scheduled transfer' })
  @ApiResponse({ status: 201, description: 'Scheduled transfer created successfully' })
  createScheduled(@Request() req, @Body() createScheduledTransferDto: CreateScheduledTransferDto) {
    return this.transfersService.createScheduledTransfer(req.user.id, createScheduledTransferDto);
  }

  @Get('scheduled')
  @ApiOperation({ summary: 'Get scheduled transfers' })
  @ApiResponse({ status: 200, description: 'Scheduled transfers retrieved successfully' })
  getScheduled(@Request() req) {
    return this.transfersService.getScheduledTransfers(req.user.id);
  }

  @Patch('scheduled/:id/pause')
  @ApiOperation({ summary: 'Pause scheduled transfer' })
  @ApiResponse({ status: 200, description: 'Scheduled transfer paused successfully' })
  pauseScheduled(@Param('id') id: string, @Request() req) {
    return this.transfersService.pauseScheduledTransfer(id, req.user.id);
  }

  @Patch('scheduled/:id/resume')
  @ApiOperation({ summary: 'Resume scheduled transfer' })
  @ApiResponse({ status: 200, description: 'Scheduled transfer resumed successfully' })
  resumeScheduled(@Param('id') id: string, @Request() req) {
    return this.transfersService.resumeScheduledTransfer(id, req.user.id);
  }

  @Delete('scheduled/:id')
  @ApiOperation({ summary: 'Cancel scheduled transfer' })
  @ApiResponse({ status: 200, description: 'Scheduled transfer cancelled successfully' })
  cancelScheduled(@Param('id') id: string, @Request() req) {
    return this.transfersService.cancelScheduledTransfer(id, req.user.id);
  }

  @Get('bank-downtimes')
  @ApiOperation({ summary: 'Get current bank downtimes' })
  @ApiResponse({ status: 200, description: 'Bank downtimes retrieved successfully' })
  getBankDowntimes() {
    return this.transfersService.getBankDowntimes();
  }
}