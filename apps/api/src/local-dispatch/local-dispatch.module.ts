import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LocalDispatchController } from './local-dispatch.controller';
import { LocalDispatchService } from './local-dispatch.service';

@Module({
  imports: [AuthModule],
  controllers: [LocalDispatchController],
  providers: [LocalDispatchService],
  exports: [LocalDispatchService],
})
export class LocalDispatchModule {}
