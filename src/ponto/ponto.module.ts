import { Module } from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoController } from './ponto.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports: [AuthModule],
  providers: [PontoService, AuthService, UserRoleGuard, UsuarioService],
  controllers: [PontoController],
})
export class PontoModule {}
