import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProjetoModule } from './projeto/projeto.module';
import { PontoModule } from './ponto/ponto.module';
import { AtualizacaoModule } from './atualizacao/atualizacao.module';
import { MaterialModule } from './material/material.module';
import { AgendaModule } from './agenda/agenda.module';
import { AuthModule } from './auth/auth.module';
import { UserRoleGuard } from './auth/guards/admin-role.guard';
import { SessaoModule } from './sessao/sessao.module';

@Module({
  imports: [
    UsuarioModule,
    ProjetoModule,
    PontoModule,
    AtualizacaoModule,
    MaterialModule,
    AgendaModule,
    AuthModule,
    SessaoModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserRoleGuard],
})
export class AppModule {}
