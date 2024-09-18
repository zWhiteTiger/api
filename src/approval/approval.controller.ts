import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Controller('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  // Create a new approval
  @Post()
  async createApproval(@Body() createApprovalDto: CreateApprovalDto) {
    return this.approvalService.createApproval(createApprovalDto);
  }

  // Get all approvals for a specific document
  @Get(':doc_id')
  async getApprovalsByDocId(@Param('doc_id') docId: string) {
    return this.approvalService.getApprovalsByDocId(docId);
  }

  // Get a single approval by its ID
  @Get('detail/:doc_id')
  async getApprovalById(@Param('doc_id') doc_id: string) {
    return this.approvalService.getApprovalById(doc_id);
  }

  // Update an approval by ID
  @Patch(':doc_id')
  async updateApproval(
    @Param('doc_id') doc_id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
  ) {
    return this.approvalService.updateApproval(doc_id, updateApprovalDto);
  }

  // Soft delete an approval
  @Delete(':doc_id')
  async deleteApproval(@Param('docs_path') doc_id: string) {
    await this.approvalService.deleteApproval(doc_id);
    return { message: 'Approval deleted successfully' };
  }
}
