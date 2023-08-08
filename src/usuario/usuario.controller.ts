import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CadUsuarioDTO } from './DTO/cadastrar.dto';
import { ShowUsuarioDTO } from './DTO/mostrar.dto';
import { AtUsuarioDTO } from './DTO/atualizar.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('novo')
  public async cadastro(@Body() u: CadUsuarioDTO): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.usuarioService.cadastrar(u);
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Get(':id')
  public async buscarID(@Param('id') id: string): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.usuarioService.buscarID(id);
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Get()
  public async buscarEmail(
    @Query('email') email: string,
  ): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.buscarEmail(email);
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Put(':id')
  public async atualizar(
    @Param('id') id: string,
    @Body() u: AtUsuarioDTO,
  ): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.usuarioService.atualizar(id, u);
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Delete()
  public async deletar(@Query('id') id: string): Promise<string> {
    const message = await this.usuarioService.deletar(id);
    if (!message) {
      return;
    }
    return message;
  }
}
