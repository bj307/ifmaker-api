import { Module } from '@nestjs/common';
import { AtualizacaoService } from './atualizacao.service';
import { AtualizacaoController } from './atualizacao.controller';
import { ProjetoService } from 'src/projeto/projeto.service';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  providers: [AtualizacaoService, ProjetoService, AuthService, UsuarioService],
  controllers: [AtualizacaoController],
})
export class AtualizacaoModule {}
