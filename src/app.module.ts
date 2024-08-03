import { Module } from '@nestjs/common';
import { DocModule } from './doc/doc.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module'; // Import UploadModule
import { ServeStaticModule } from '@nestjs/serve-static'; // Import ServeStaticModule
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocModule,
    MongooseModule.forRoot("mongodb://root:example@localhost:27017/docs?authSource=admin"),
    AuthModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets', 'pdf'), // Serve files from './assets/pdf/'
      serveRoot: '/pdf', // URL path prefix for accessing static files
    },
    {
      rootPath: join(__dirname, '..', 'assets', 'profile'), // Serve files from './assets/pdf/'
      serveRoot: '/profile', // URL path prefix for accessing static files
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
