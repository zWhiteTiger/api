import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DocService } from './doc.service';
import { DocsDto } from './dto/docs.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './assets/pdf', // Directory to save the files
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        const fileName = `${Date.now()}${fileExtName}`;
        callback(null, fileName);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  }))
  async create(@Body() dto: DocsDto, @UploadedFile() file: Express.Multer.File, @Res() res: Response, @Req() req: { user: { email: string, sub: string } }) {
    console.log(dto, file); // You can remove this after debugging

    // Extract the filename without the extension
    const fileExtName = extname(file.originalname);
    const fileNameWithoutExt = basename(file.originalname, fileExtName);

    const fileUrl = `/pdf/${file.filename}`;

    // Save the document with the name without the extension
    const { _id } = await this.docService.create({ ...dto, doc_name: fileNameWithoutExt, user_id: req.user.sub }, file.filename);

    return res.status(HttpStatus.OK).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
      docID: _id.toString(),
    });
  }

  @Get()
  async findAll() {
    return this.docService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':docsPath')
  async getDocumentByPath(
    @Param('docsPath') docsPath: string,
    @Req() req: { user: { email: string } }
  ) {
    const document = await this.docService.findByPath(docsPath);
    if (!document) {
      throw new NotFoundException(`Document with path ${docsPath} not found`);
    }
    return {
      docName: document.doc_name,
      userId: document.user_id,
      public: document.public,
      docsPath: document.docs_path,
      _id: document._id,
      currentPriority: document.currentPriority,
    };
  }

  @Delete(':docId')
  async deleteOne(@Param('docId') docId: string): Promise<any> {
    console.log(`DocController.deleteOne received docId:`, docId, `Type:`, typeof docId);

    return this.docService.deleteOne(docId);
  }

  @Patch(':docId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('docId') docId: string,
    @Body() updateDto: Partial<DocsDto>,
    @Req() req: { user: { email: string, sub: string } },
    @Res() res: Response
  ) {
    try {
      const document = await this.docService.findOne(docId);
      if (!document) {
        throw new NotFoundException(`Document with ID ${docId} not found`);
      }

      const updatedDoc = await this.docService.update(docId, {
        ...updateDto,
        user_id: req.user.sub, // Update user_id from authenticated user
      });

      return res.status(HttpStatus.OK).json({
        message: 'Document updated successfully!',
        updatedDoc,
      });
    } catch (error) {
      console.error(`Error updating document:`, error);
      throw new BadRequestException('Error updating document');
    }
  }
}
