import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { Doc, DocDocument } from './schema/doc.schema';
import { DocsDto } from './dto/docs.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocService {
  constructor(
    @InjectModel(Doc.name) private docModel: Model<DocDocument>,
  ) { }

  async create(dto: DocsDto, file: string): Promise<any> {
    const doc = new this.docModel({
      doc_name: dto.doc_name,
      user_id: new Types.ObjectId(dto.user_id),
      docs_path: file,

    });
    return doc.save();
  }

  async findAll(): Promise<Doc[]> {
    return this.docModel.find().exec();
    // return this.docModel.find({user_id:'667a65043fa72013b513abe7'}).populate('user_id').exec();

  }

  async findByPath(docsPath: string): Promise<Doc | null> {
    return this.docModel.findOne({ docs_path: docsPath }).exec();
  }

  async findOne(docId: string): Promise<Doc> {
    return this.docModel.findById(docId).exec();
  }

  async deleteOne(docId: string): Promise<Doc> {
    // Log the docId to verify its type and value
    console.log(`DocService.deleteOne called with docId:`, docId, `Type:`, typeof docId);

    // Ensure docId is a string
    if (typeof docId !== 'string') {
      throw new Error('docId must be a string');
    }

    // Find and delete the document from the database
    const doc = await this.docModel.findOneAndDelete({ _id: docId }).exec();

    // Check if the document exists
    if (doc) {
      // Construct the file path
      const filePath = path.join(process.cwd(), 'assets', 'pdf', doc.docs_path);

      console.log(filePath)

      // Delete the file if it exists
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${filePath}`, err);
        } else {
          console.log(`Successfully deleted file: ${filePath}`);
        }
      });
    } else {
      console.log(`Document with id ${docId} not found.`);
    }

    return doc;
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