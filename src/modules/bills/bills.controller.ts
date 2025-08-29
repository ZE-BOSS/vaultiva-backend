import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RecurringPaymentsService } from './recurring-payments.service';
import { TransactionType } from '../wallet/entities/transaction.entity';

@ApiTags('Bills')
@Controller('bills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private recurringService: RecurringPaymentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all available bills' })
  @ApiResponse({ status: 200, description: 'Bills retrieved successfully' })
  findProvider() {
    return this.billsService.getProviders();
  }

  @Get(':category')
  @ApiOperation({ summary: 'Get all available bill category' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  findCategories(@Param('category') category: string) {
    return this.billsService.getBillers(category);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get all available bill plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  findPlans(@Param('code') code: string) {
    return this.billsService.getPlans(code);
  }

  @Post()
  @ApiOperation({ summary: 'Pay bill' })
  @ApiResponse({ status: 200, description: 'Bill payment successfully' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  payBill(@Body() body: any, @Param('walletId') walletId, @Req() req) {
    const { reccuring, duration, ...prop } = body

    return this.billsService.payBill(req.user.id, walletId, prop, reccuring, duration);
  }

  @Get('recurring/resume/:id')
  @ApiOperation({ summary: 'Resume recurring payment' })
  @ApiResponse({ status: 200, description: 'Recurring Payment Successfully Resumed' })
  resumeRecurring(@Param('id') id) {
    return this.recurringService.resumeRecurringPayment(id);
  }

  @Get('recurring/pause/:id')
  @ApiOperation({ summary: 'Pause recurring payment' })
  @ApiResponse({ status: 200, description: 'Recurring Payment Successfully Paused' })
  pauseRecurring(@Param('id') id: string) {
    return this.recurringService.pauseRecurringPayment(id);
  }

  @Get('recurring/cancel/:id')
  @ApiOperation({ summary: 'Cancel recurring payment' })
  @ApiResponse({ status: 200, description: 'Recurring Payment Successfully Canceled' })
  cancelRecurring(@Param('id') id: string) {
    return this.recurringService.cancelRecurringPayment(id);
  }

  @Get('recurring/list/:type')
  @ApiOperation({ summary: 'Get recurring payments' })
  @ApiResponse({ status: 200, description: 'Recurring Payment Successfully Retrieved' })
  getRecurring(@Param('type') type: string, @Req() req) {
    return this.recurringService.listRecurring(req.user.id, type as TransactionType);
  }
}