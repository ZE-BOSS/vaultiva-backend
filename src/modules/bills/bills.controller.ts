import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { BillType } from './entities/bill.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Bills')
@Controller('bills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available bills' })
  @ApiResponse({ status: 200, description: 'Bills retrieved successfully' })
  findAll() {
    return this.billsService.findAll();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get bills by type' })
  @ApiResponse({ status: 200, description: 'Bills retrieved successfully' })
  findByType(@Param('type') type: BillType) {
    return this.billsService.findByType(type);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get user bill payment history' })
  @ApiResponse({ status: 200, description: 'Bill payments retrieved successfully' })
  getUserPayments(@Request() req) {
    return this.billsService.getUserBillPayments(req.user.id);
  }

  @Get('payments/:id')
  @ApiOperation({ summary: 'Get bill payment by ID' })
  @ApiResponse({ status: 200, description: 'Bill payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bill payment not found' })
  getPaymentById(@Param('id') id: string) {
    return this.billsService.getBillPaymentById(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bill by ID' })
  @ApiResponse({ status: 200, description: 'Bill retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  findOne(@Param('id') id: string) {
    return this.billsService.findById(id);
  }
}