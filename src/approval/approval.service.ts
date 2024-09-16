import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { Approval } from './approval.schema';

@Injectable()
export class ApprovalService {
    constructor(@InjectModel(Approval.name) private approvalModel: Model<Approval>) { }

    async create(createApprovalDto: CreateApprovalDto): Promise<Approval> {
        const newApproval = new this.approvalModel(createApprovalDto);
        return newApproval.save();
    }

    async findAll(): Promise<Approval[]> {
        return this.approvalModel.find().exec();
    }

    async findByDocId(doc_id: string): Promise<Approval[]> {
        return this.approvalModel.find({ doc_id }).exec();
    }

    async findOne(id: string): Promise<Approval> {
        const approval = await this.approvalModel.findById(id).exec();
        if (!approval) {
            throw new NotFoundException(`Approval with ID ${id} not found`);
        }
        return approval;
    }

    async update(id: string, updateApprovalDto: UpdateApprovalDto): Promise<Approval> {
        const updatedApproval = await this.approvalModel.findByIdAndUpdate(id, updateApprovalDto, { new: true }).exec();
        if (!updatedApproval) {
            throw new NotFoundException(`Approval with ID ${id} not found`);
        }
        return updatedApproval;
    }

    async remove(id: string): Promise<void> {
        const result = await this.approvalModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Approval with ID ${id} not found`);
        }
    }
}
