import { Controller, Post, UseInterceptors, UploadedFile, Res, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  @Post('file')
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
  uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Only PDF and DOCX files are allowed!',
      });
    }

    // File URL is relative to the public directory
    const fileUrl = `/pdf/${file.filename}`;
    return res.status(HttpStatus.OK).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
    });
  }

  randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // กำหนดโฟลเดอร์ที่ต้องการจัดเก็บไฟล์
        filename: (req, file, callback) => {
          const newFilename = this.randomString();
          callback(null, newFilename);
        },
      }),
    }),
  )
  ChangeName(@UploadedFile() file: Express.Multer.File) {
    // return this.uploadService.handleFileUpload(file);
    return
  }
}
