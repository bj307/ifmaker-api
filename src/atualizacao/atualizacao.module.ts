import { Module } from '@nestjs/common';
import { AtualizacaoService } from './atualizacao.service';
import { AtualizacaoController } from './atualizacao.controller';
import { MaterialService } from 'src/material/material.service';

@Module({
  providers: [AtualizacaoService, MaterialService],
  controllers: [AtualizacaoController],
})
export class AtualizacaoModule {}
