import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { CreateJobRequest, CreateProposalRequest, JwtPayload } from '@baara/shared-types';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guard';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  list(@Query('country') country?: string) {
    return { items: this.jobsService.listJobs(country) };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ENTERPRISE')
  create(@Req() req: { user: JwtPayload }, @Body() body: CreateJobRequest) {
    return this.jobsService.createJob(req.user.sub, body);
  }

  @Post(':id/proposals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FREELANCER', 'LOCAL_PROVIDER', 'AGENCY')
  submitProposal(
    @Param('id') jobId: string,
    @Req() req: { user: JwtPayload },
    @Body() body: CreateProposalRequest,
  ) {
    return this.jobsService.submitProposal(jobId, req.user.sub, body);
  }

  @Post(':id/proposals/:proposalId/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ENTERPRISE')
  acceptProposal(
    @Param('id') jobId: string,
    @Param('proposalId') proposalId: string,
    @Req() req: { user: JwtPayload },
  ) {
    return this.jobsService.acceptProposal(jobId, proposalId, req.user.sub);
  }
}
