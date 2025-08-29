import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Rewards')
@Controller('rewards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user rewards' })
  @ApiResponse({ status: 200, description: 'Rewards retrieved successfully' })
  getUserRewards(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.rewardsService.getUserRewards(req.user.id, page, limit);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get reward summary' })
  @ApiResponse({ status: 200, description: 'Reward summary retrieved successfully' })
  getRewardSummary(@Request() req) {
    return this.rewardsService.getRewardSummary(req.user.id);
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Redeem reward' })
  @ApiResponse({ status: 200, description: 'Reward redeemed successfully' })
  redeemReward(@Param('id') id: string, @Request() req) {
    return this.rewardsService.redeemReward(id, req.user.id);
  }
}