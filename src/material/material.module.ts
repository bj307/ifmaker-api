import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';

@Module({
  providers: [MaterialService],
  controllers: [MaterialController]
})
export class MaterialModule {}
