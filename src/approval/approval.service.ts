import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Approval } from './schema/approval.schema';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectModel(Approval.name) private readonly approvalModel: Model<Approval>,
  ) {}

  // Create a new approval
  async createApproval(createApprovalDto: CreateApprovalDto): Promise<Approval> {
    const newApproval = new this.approvalModel(createApprovalDto);
    return await newApproval.save();
  }

  // Get all approvals for a specific document
  async getApprovalsByDocId(docId: string): Promise<Approval[]> {
    return this.approvalModel.find({ doc_id: docId, delete_at: null }).exec();
  }

  // Get an approval by its ID
  async getApprovalById(docs_path: string): Promise<Approval> {
    const approval = await this.approvalModel.findById(docs_path).exec();
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${docs_path} not found`);
    }
    return approval;
  }

  // Update an approval's position, signature, or other details
  async updateApproval(id: string, updateApprovalDto: UpdateApprovalDto): Promise<Approval> {
    const updatedApproval = await this.approvalModel.findByIdAndUpdate(
      id,
      updateApprovalDto,
      { new: true },
    ).exec();

    if (!updatedApproval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    return updatedApproval;
  }

  // Soft delete an approval
  async deleteApproval(id: string): Promise<void> {
    const approval = await this.approvalModel.findByIdAndUpdate(
      id,
      { delete_at: new Date() },
      { new: true },
    ).exec();

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }
  }
}
