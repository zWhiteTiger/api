import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApprovalService } from './approval.service';
import { ApprovalController } from './approval.controller';
import { Approval, ApprovalSchema } from './schema/approval.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Approval.name, schema: ApprovalSchema }]),
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService],
})
export class ApprovalModule {}
