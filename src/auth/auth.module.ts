import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  providers: [AuthService, UsuarioService],
  exports: [AuthService],
})
export class AuthModule {}
