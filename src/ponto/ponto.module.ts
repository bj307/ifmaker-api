import { Module } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoController } from './ponto.controller';

@Module({
  providers: [PontoService],
  controllers: [PontoController]
})
export class PontoModule {}
