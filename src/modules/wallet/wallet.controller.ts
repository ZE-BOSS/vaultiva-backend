import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionType } from './entities/transaction.entity';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  create(@Request() req, @Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(req.user.id, createWalletDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wallets' })
  @ApiResponse({ status: 200, description: 'Wallets retrieved successfully' })
  findAll(@Request() req) {
    return this.walletService.findUserWallets(req.user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Transaction history retrieved successfully' })
  getTransactionHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.walletService.getTransactionHistory(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wallet by ID' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  findOne(@Param('id') id: string) {
    return this.walletService.findWalletById(id);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from wallet' })
  @ApiResponse({ status: 200, description: 'Withdrawal initiated successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient balance' })
  withdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
    return this.walletService.withdraw(req.user.id, TransactionType.WITHDRAWAL, withdrawDto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Process payment webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  processWebhook(@Body() payload: any) {
    return this.walletService.processWebhook(payload);
  }
}