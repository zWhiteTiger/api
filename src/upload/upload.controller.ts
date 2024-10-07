import { Controller, Post, UseInterceptors, UploadedFile, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('upload')
export class UploadController {

  constructor(private readonly usersServices: UsersService) {

  }

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
      // id: id,
    });
  }

  randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }


  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/profile', // Directory to save the images
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          const newFilename = `${uniqueSuffix}${fileExtName}`;
          callback(null, newFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.'), false);
        }
      },
    }),
  )
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { email: string, sub: string } },
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid file type. Only PNG, JPG, and JPEG are allowed.',
      });
    }

    const userEmail = req.user.email;
    const filePath = `/profile/${file.filename}`;

    // Save the image path to the user's profile in the database
    await this.usersServices.updateUserProfilePicture(userEmail, filePath); // Corrected to 'usersServices'

    return res.status(HttpStatus.OK).json({
      message: 'Profile picture uploaded successfully!',
      url: filePath,
    });
  }

  @Post('signature')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/signature', // Directory to save the signature files
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtName = extname(file.originalname);
          const newFilename = `${uniqueSuffix}${fileExtName}`;
          callback(null, newFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.'), false);
        }
      },
    }),
  )
  async uploadSignaturePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { email: string, sub: string } },
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid file type. Only PNG, JPG, and JPEG are allowed.',
      });
    }

    const userEmail = req.user.email;
    const filename = file.filename; // Only keep filename and extension

    // Save the filename to the user's profile in the database
    await this.usersServices.updateUserSignature(userEmail, filename);

    return res.status(HttpStatus.OK).json({
      message: 'Signature picture uploaded successfully!',
      filename, // Return filename for reference
    });
  }

}
