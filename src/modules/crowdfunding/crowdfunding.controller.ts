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
import { CrowdfundingService } from './crowdfunding.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ContributeDto } from './dto/contribute.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';

@ApiTags('Crowdfunding')
@Controller('crowdfunding')
@ApiBearerAuth()
export class CrowdfundingController {
  constructor(private readonly crowdfundingService: CrowdfundingService) {}

  @Post('campaigns')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create crowdfunding campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  createCampaign(@Request() req, @Body() createCampaignDto: CreateCampaignDto) {
    return this.crowdfundingService.createCampaign(req.user.id, createCampaignDto);
  }

  @Get('campaigns')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user campaigns' })
  @ApiResponse({ status: 200, description: 'Campaigns retrieved successfully' })
  findUserCampaigns(
    @Request() req,
    @Query('page', new PositiveIntPipe(1)) page: number,
    @Query('limit', new PositiveIntPipe(20, 100)) limit: number,
  ) {
    return this.crowdfundingService.findUserCampaigns(req.user.id, page, limit);
  }

  @Get('campaigns/public/:shareableLink')
  @Public()
  @ApiOperation({ summary: 'Get public campaign by shareable link' })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  getPublicCampaign(@Param('shareableLink') shareableLink: string) {
    return this.crowdfundingService.getPublicCampaign(shareableLink);
  }

  @Get('campaigns/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.crowdfundingService.findOne(id, req.user.id);
  }

  @Post('campaigns/:id/contribute')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Contribute to campaign' })
  @ApiResponse({ status: 200, description: 'Contribution successful' })
  contribute(
    @Param('id') id: string,
    @Body() contributeDto: ContributeDto,
    @Request() req,
  ) {
    return this.crowdfundingService.contribute(id, req.user.id, contributeDto);
  }

  @Get('campaigns/:id/contributions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get campaign contributions' })
  @ApiResponse({ status: 200, description: 'Contributions retrieved successfully' })
  getContributions(
    @Param('id') id: string,
    @Query('page', new PositiveIntPipe(1)) page: number,
    @Query('limit', new PositiveIntPipe(20, 100)) limit: number,
  ) {
    return this.crowdfundingService.getCampaignContributions(id, page, limit);
  }
}