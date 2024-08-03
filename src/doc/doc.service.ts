import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { Doc, DocDocument } from './schema/doc.schema';
import { DocsDto } from './dto/docs.dto';

@Injectable()
export class DocService {
  constructor(
    @InjectModel(Doc.name) private docModel: Model<DocDocument>,
  ) {}

  async create(dto: DocsDto): Promise<any> {
    const doc = new this.docModel({
      doc_name: dto.doc_name,
      doc_id: randomUUID(),
      user_id: dto.user_id,
    });
    return doc.save();
  }

  async findAll(): Promise<Doc[]> {
    // return this.docModel.find().exec();
    return this.docModel.find({user_id:'667a65043fa72013b513abe7'}).populate('user_id').exec();

  }
}


// async findOne(docId: string): Promise<Doc> {
//   // Log the docId to verify its type and value
//   console.log(`DocService.findOne called with docId:`, docId, `Type:`, typeof docId);

//   // Ensure docId is a string
//   if (typeof docId !== 'string') {
//     throw new Error('docId must be a string');
//   }

//   return this.docModel.findOne({ doc_id: docId }).exec();
// }

// async deleteOne(docId: string): Promise<Doc> {
//   // Log the docId to verify its type and value
//   console.log(`DocService.deleteOne called with docId:`, docId, `Type:`, typeof docId);

//   // Ensure docId is a string
//   if (typeof docId !== 'string') {
//     throw new Error('docId must be a string');
//   }

//   return this.docModel.findOneAndDelete({ doc_id: docId }).exec();
// }