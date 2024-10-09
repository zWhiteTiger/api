import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) { }

  // Create a new approval
  @Post()
  async createApproval(@Body() createApprovalDto: CreateApprovalDto) {
    return this.approvalService.createApproval(createApprovalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getByEmailApprovals(
    @Req() req: { user: { email: string, sub: string } }
  ) {
    return this.approvalService.getApprovalByEmail(req.user.email)
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createApprovals(@Body() dto: CreateApprovalDto, @Req() req: { user: { email: string, sub: string } }) {
    return this.approvalService.createApproval(dto)
  }

  // Get all approvals for a specific document
  @Get(':docs_path')
  async getApprovalsByDocId(@Param('docs_path') docs_path: string) {
    return this.approvalService.getApprovalsByDocId(docs_path);
  }

  // Get a single approval by its ID
  @Get('detail/:doc_id')
  async getApprovalById(@Param('doc_id') doc_id: string) {
    return this.approvalService.getApprovalById(doc_id);
  }

  // Update an approval by ID
  @Patch(':_id')
  async updateApproval(
    @Param('_id') _id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
  ) {
    return this.approvalService.updateApproval(_id, updateApprovalDto);
  }

  // Soft delete an approval
  @Delete(':_id')
  async deleteApproval(@Param('_id') _id: string) {
    await this.approvalService.deleteApproval(_id);
    return { message: 'Approval deleted successfully' };
  }

}
