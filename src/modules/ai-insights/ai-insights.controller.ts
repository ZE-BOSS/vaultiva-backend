import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiInsightsService } from './ai-insights.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';

@ApiTags('AI Insights')
@Controller('ai-insights')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiInsightsController {
  constructor(private readonly aiInsightsService: AiInsightsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI spending insights' })
  @ApiResponse({ status: 200, description: 'Insights generated successfully' })
  generateInsights(@Request() req) {
    return this.aiInsightsService.generateInsights(req.user.id);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get user spending insights' })
  @ApiResponse({ status: 200, description: 'Insights retrieved successfully' })
  getInsights(
    @Request() req,
    @Query('page', new PositiveIntPipe(1)) page: number,
    @Query('limit', new PositiveIntPipe(20, 100)) limit: number,
  ) {
    return this.aiInsightsService.getUserInsights(req.user.id, page, limit);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get budget recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved successfully' })
  getRecommendations(@Request() req) {
    return this.aiInsightsService.getBudgetRecommendations(req.user.id);
  }

  @Patch('insights/:id/read')
  @ApiOperation({ summary: 'Mark insight as read' })
  @ApiResponse({ status: 200, description: 'Insight marked as read' })
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.aiInsightsService.markInsightAsRead(id, req.user.id);
  }

  @Patch('recommendations/:id/implement')
  @ApiOperation({ summary: 'Mark recommendation as implemented' })
  @ApiResponse({ status: 200, description: 'Recommendation marked as implemented' })
  implementRecommendation(@Param('id') id: string, @Request() req) {
    return this.aiInsightsService.implementRecommendation(id, req.user.id);
  }
}