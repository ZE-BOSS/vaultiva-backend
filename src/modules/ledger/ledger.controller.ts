import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { LedgerProvider } from './entities/ledger-entry.entity';

@ApiTags('Ledger')
@Controller('ledger')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get('entries')
  @ApiOperation({ summary: 'Get ledger entries' })
  @ApiResponse({ status: 200, description: 'Ledger entries retrieved successfully' })
  getLedgerEntries(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('provider') provider?: LedgerProvider,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.ledgerService.getLedgerEntries(
      req.user.id,
      start,
      end,
      provider,
      page,
      limit
    );
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get balance summary' })
  @ApiResponse({ status: 200, description: 'Balance summary retrieved successfully' })
  getBalanceSummary(@Request() req) {
    return this.ledgerService.getBalanceSummary(req.user.id);
  }

  @Get('admin/entries')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all ledger entries (Admin)' })
  @ApiResponse({ status: 200, description: 'All ledger entries retrieved successfully' })
  getAllLedgerEntries(
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('provider') provider?: LedgerProvider,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.ledgerService.getLedgerEntries(
      userId,
      start,
      end,
      provider,
      page,
      limit
    );
  }

  @Get('admin/balance')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get system balance summary (Admin)' })
  @ApiResponse({ status: 200, description: 'System balance summary retrieved successfully' })
  getSystemBalanceSummary() {
    return this.ledgerService.getBalanceSummary();
  }

  @Post('admin/reconcile')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Perform manual reconciliation (Admin)' })
  @ApiResponse({ status: 200, description: 'Reconciliation completed successfully' })
  performReconciliation(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.ledgerService.reconcileTransactions(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get('admin/reconciliation-history')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get reconciliation history (Admin)' })
  @ApiResponse({ status: 200, description: 'Reconciliation history retrieved successfully' })
  getReconciliationHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.ledgerService.getReconciliationHistory(page, limit);
  }
}