import { Module } from '@nestjs/common';
import { ProjetoService } from './projeto.service';
import { ProjetoController } from './projeto.controller';

@Module({
  providers: [ProjetoService],
  controllers: [ProjetoController]
})
export class ProjetoModule {}
