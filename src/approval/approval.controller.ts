import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Controller('approval')
export class ApprovalController {
    constructor(private readonly approvalService: ApprovalService) { }

    @Post()
    async create(@Body() createApprovalDto: CreateApprovalDto) {
        return this.approvalService.create(createApprovalDto);
    }

    @Get()
    async findAll() {
        return this.approvalService.findAll();
    }

    @Get(':doc_id')
    async findByDocId(@Param('doc_id') doc_id: string) {
        return this.approvalService.findByDocId(doc_id);
    }

    @Get('detail/:id')
    async findOne(@Param('id') id: string) {
        return this.approvalService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateApprovalDto: UpdateApprovalDto) {
        return this.approvalService.update(id, updateApprovalDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.approvalService.remove(id);
    }

}
