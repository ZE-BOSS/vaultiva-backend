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
import { BillSplittingService } from './bill-splitting.service';
import { CreateBillSplitDto } from './dto/create-bill-split.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Bill Splitting')
@Controller('bill-splitting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillSplittingController {
  constructor(private readonly billSplittingService: BillSplittingService) {}

  @Post()
  @ApiOperation({ summary: 'Create new bill split' })
  @ApiResponse({ status: 201, description: 'Bill split created successfully' })
  create(@Request() req, @Body() createBillSplitDto: CreateBillSplitDto) {
    return this.billSplittingService.create(req.user.id, createBillSplitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user bill splits' })
  @ApiResponse({ status: 200, description: 'Bill splits retrieved successfully' })
  findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.billSplittingService.findUserBillSplits(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bill split by ID' })
  @ApiResponse({ status: 200, description: 'Bill split retrieved successfully' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.billSplittingService.findOne(id, req.user.id);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute bill split' })
  @ApiResponse({ status: 200, description: 'Bill split executed successfully' })
  execute(@Param('id') id: string, @Request() req) {
    return this.billSplittingService.executeBillSplit(id, req.user.id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept bill split invitation' })
  @ApiResponse({ status: 200, description: 'Bill split invitation accepted' })
  acceptInvitation(@Param('id') id: string, @Request() req) {
    return this.billSplittingService.acceptInvitation(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel bill split' })
  @ApiResponse({ status: 200, description: 'Bill split cancelled successfully' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.billSplittingService.cancel(id, req.user.id);
  }
}