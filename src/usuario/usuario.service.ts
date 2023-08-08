import { Injectable } from '@nestjs/common';
import { CadUsuarioDTO } from './DTO/cadastrar.dto';
import { ShowUsuarioDTO } from './DTO/mostrar.dto';
import { AtUsuarioDTO } from './DTO/atualizar.dto';

@Injectable()
export class UsuarioService {
  async cadastrar(u: CadUsuarioDTO): Promise<ShowUsuarioDTO> {
    return u;
  }

  async buscarID(id: string): Promise<ShowUsuarioDTO> {
    return id;
  }

  async buscarEmail(email: string): Promise<ShowUsuarioDTO> {
    return email;
  }

  async atualizar(id: string, u: AtUsuarioDTO): Promise<ShowUsuarioDTO> {
    return u;
  }

  async deletar(id: string): Promise<string> {
    return id;
  }
}
