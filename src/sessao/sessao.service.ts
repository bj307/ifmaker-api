import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LoginDTO } from './DTO/login.dto';

@Injectable()
export class SessaoService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  async login(
    l: LoginDTO,
  ): Promise<{ id: string; nome: string; jwtToken: string; email: string }> {
    const valid = this.usuarioService.checkPassword(l.senha, l.email);
    if (!valid) {
      throw new NotFoundException('Credenciais inválidas.');
    }
    const usuario = await this.usuarioService.buscarEmail(l.email);

    const jwtToken = await this.authService.createAccessToken(
      usuario.id,
      usuario.nivel_acesso,
    );
    return {
      id: usuario.id,
      nome: usuario.nome,
      jwtToken,
      email: usuario.email,
    };
  }
}
