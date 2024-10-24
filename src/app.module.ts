import { Module } from '@nestjs/common';
import { DocModule } from './doc/doc.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module'; // Import UploadModule
import { ServeStaticModule } from '@nestjs/serve-static'; // Import ServeStaticModule
import { join } from 'path';
import { ApprovalModule } from './approval/approval.module';
import { MailService } from './mailer/mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UploadModule,
    ApprovalModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets', 'pdf'), // Serve files from './assets/pdf/'
      serveRoot: '/pdf', // URL path prefix for accessing static files
    },
      {
        rootPath: join(__dirname, '..', 'assets', 'profile'), // Serve files from './assets/pdf/'
        serveRoot: '/profile', // URL path prefix for accessing static files
      },
      {
        rootPath: join(__dirname, '..', 'assets', 'signature'), // Serve files from './assets/pdf/'
        serveRoot: '/signature', // URL path prefix for accessing static files
      }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
