import { Module } from '@nestjs/common';
import { SessaoController } from './sessao.controller';
import { SessaoService } from './sessao.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports: [AuthModule],
  controllers: [SessaoController],
  providers: [SessaoService, AuthService, UsuarioService],
})
export class SessaoModule {}
