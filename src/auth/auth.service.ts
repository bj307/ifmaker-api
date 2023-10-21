import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './model/jwtpayload.model';
import { ShowUsuarioDTO } from 'src/usuario/DTO/mostrar.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private usuarioService: UsuarioService,
  ) {}

  public async createAccessToken(
    userId: string,
    nivel_acesso: string,
  ): Promise<string> {
    return sign({ userId, nivel_acesso }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  public async validateUser(jwtPayload: JwtPayload): Promise<ShowUsuarioDTO> {
    const usuario = await this.usuarioService.buscarID(jwtPayload.userId);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não autorizado.');
    }

    return usuario;
  }

  public async jwtExtractor(request: Request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException(
        'Bad request. Token inválido! esse bad aqui',
      );
    }

    const [, token] = authHeader.split(' ');

    return token;
  }

  private static jwtExtractorr(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('Bad request. Token inválido!');
    }

    const [, token] = authHeader.split(' ');

    return token;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return AuthService.jwtExtractorr;
  }
}
