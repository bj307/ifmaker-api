import { Module } from '@nestjs/common';
import { AtualizacaoService } from './atualizacao.service';
import { AtualizacaoController } from './atualizacao.controller';

@Module({
  providers: [AtualizacaoService],
  controllers: [AtualizacaoController]
})
export class AtualizacaoModule {}
