import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DocService } from './doc.service';
import { DocsDto } from './dto/docs.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
    const fileUrl = `/pdf/${file.filename}`;
    await this.docService.create({ ...dto, user_id: req.user.sub }, file.filename);
    return res.status(HttpStatus.OK).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
    });
    // Here you would typically save the document data to the database and handle the file as needed.
    // Example: return this.docService.create(dto, file);
  }

  @Get()
  async findAll() {
    return this.docService.findAll();
  }

  @Delete(':docId')
  async deleteOne(@Param('docId') docId: string): Promise<any> {
    // Log the received docId and its type
    console.log(`DocController.deleteOne received docId:`, docId, `Type:`, typeof docId);

    return this.docService.deleteOne(docId);

    // this.docService.deleteOne(docId);
  }


}


// @Get(':docId')
// async findOne(@Param('docId') docId: string): Promise<Doc> {
//   // Log the received docId and its type
//   console.log(`DocController.findOne received docId:`, docId, `Type:`, typeof docId);

//   return this.docService.findOne(docId);
// }