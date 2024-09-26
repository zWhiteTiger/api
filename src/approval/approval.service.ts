import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Approval } from './schema/approval.schema';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectModel(Approval.name) private readonly approvalModel: Model<Approval>,
    private readonly userService: UsersService
  ) { }

  async getApprovalByEmail(email: string) {
    const approvals = await this.approvalModel.find({ email })
    return approvals
  }

  // Create a new approval
  async createApproval(dto: any): Promise<any> {
    const { signature, lastName, firstName } = await this.userService.findOne(dto.email)
    const newApproval = new this.approvalModel({
      doc_id: dto.doc_id,
      email: dto.email,
      firstName: firstName,
      lastName: lastName,
      signature: signature,
      position: dto.position, // This should be an array of { x, y } objects
      page: dto.page,
      create_at: new Date()
    });

    return await newApproval.save()
  }

  // Get all approvals for a specific document
  async getApprovalsByDocId(docId: string): Promise<Approval[]> {
    return this.approvalModel.find({ doc_id: docId, delete_at: null }).exec();
  }

  // Get an approval by its ID
  async getApprovalById(doc_id: string): Promise<Approval> {
    const approval = await this.approvalModel.findById(doc_id).exec();
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${doc_id} not found`);
    }
    return approval;
  }

  // Update an approval's position, signature, or other details
  async updateApproval(
    id: string,
    updateApprovalDto: UpdateApprovalDto,
  ): Promise<Approval> {
    const updatedApproval = await this.approvalModel.findByIdAndUpdate(
      id,
      {
        $set: updateApprovalDto  // Automatically set fields passed in the DTO
      },
      { new: true },  // Return the updated document
    ).exec();

    if (!updatedApproval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    return updatedApproval;
  }

  // Soft delete an approval
  async deleteApproval(id: string): Promise<void> {
    // Step 1: Soft delete by setting delete_at field
    const approval = await this.approvalModel.findByIdAndUpdate(
      id,
      { delete_at: new Date() },
      { new: true }
    ).exec();

    // Check if approval exists
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    // Step 2: Hard delete by removing the document from the database
    await this.approvalModel.findByIdAndDelete(id).exec();
  }
}
