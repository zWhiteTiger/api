import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApprovalService } from './approval.service';
import { Approval, ApprovalSchema } from './approval.schema';
import { ApprovalController } from './approval.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Approval.name, schema: ApprovalSchema }])],
  controllers: [ApprovalController],
  providers: [ApprovalService],
})
export class ApprovalModule {}