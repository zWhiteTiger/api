import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule, // Importing the UsersModule which likely handles user-related operations
    PassportModule, // Integrates Passport for authentication strategies
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importing ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'), // Retrieving JWT secret key from environment
        signOptions: { expiresIn: '5m' }, // Setting JWT expiration time
      }),
      inject: [ConfigService], // Injecting ConfigService into JwtModule's async setup
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy], // Providing AuthService and JwtStrategy
  exports: [AuthService], // Exporting AuthService for use in other modules
})
export class AuthModule {}
