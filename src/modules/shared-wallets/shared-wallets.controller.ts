import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SharedWalletsService } from './shared-wallets.service';
import { CreateSharedWalletDto } from './dto/create-shared-wallet.dto';
import { CreateSharedWalletTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Shared Wallets')
@Controller('shared-wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SharedWalletsController {
  constructor(private readonly sharedWalletsService: SharedWalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Create shared wallet' })
  @ApiResponse({ status: 201, description: 'Shared wallet created successfully' })
  create(@Request() req, @Body() createSharedWalletDto: CreateSharedWalletDto) {
    return this.sharedWalletsService.create(req.user.id, createSharedWalletDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user shared wallets' })
  @ApiResponse({ status: 200, description: 'Shared wallets retrieved successfully' })
  findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.sharedWalletsService.findUserSharedWallets(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shared wallet by ID' })
  @ApiResponse({ status: 200, description: 'Shared wallet retrieved successfully' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.sharedWalletsService.findOne(id, req.user.id);
  }

  @Post(':id/transact')
  @ApiOperation({ summary: 'Initiate shared wallet transaction' })
  @ApiResponse({ status: 200, description: 'Transaction initiated successfully' })
  initiateTransaction(
    @Param('id') id: string,
    @Body() createTransactionDto: CreateSharedWalletTransactionDto,
    @Request() req,
  ) {
    return this.sharedWalletsService.initiateTransaction(id, req.user.id, createTransactionDto);
  }

  @Post('transactions/:id/sign')
  @ApiOperation({ summary: 'Sign/approve transaction' })
  @ApiResponse({ status: 200, description: 'Transaction signed successfully' })
  signTransaction(
    @Param('id') id: string,
    @Body() body: { approved: boolean; comment?: string },
    @Request() req,
  ) {
    return this.sharedWalletsService.signTransaction(id, req.user.id, body.approved, body.comment);
  }
}