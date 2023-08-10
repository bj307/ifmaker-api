import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../model/jwtpayload.model';
import { ShowUsuarioDTO } from 'src/usuario/DTO/mostrar.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<ShowUsuarioDTO> {
    const usuario = await this.authService.validateUser(jwtPayload);

    if (!usuario) {
      throw new UnauthorizedException('Usuário não autorizado.');
    }

    return usuario;
  }
}
