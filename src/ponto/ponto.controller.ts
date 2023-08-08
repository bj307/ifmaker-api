import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoDTO } from './DTO/ponto.dto';

@Controller('ponto')
export class PontoController {
  constructor(private readonly pontoService: PontoService) {}

  @Post('registrar')
  public async registrar(@Body() p: PontoDTO): Promise<string> {
    const ponto = await this.pontoService.registrar(p);
    if (!ponto) {
      return;
    }
    return ponto;
  }

  @Get(':id')
  public async buscarID(@Param('id') id: string) {
    const ponto = await this.pontoService.buscarID(id);
    if (!ponto) {
      return;
    }
    return ponto;
  }

  @Get()
  public async buscar(
    @Query('user') user: string,
    @Query('type') type: string,
  ) {
    if (user) {
      const pontoUsuario = await this.pontoService.buscarUsuario(user);
      if (!pontoUsuario) {
        return;
      }
      return pontoUsuario;
    } else if (type) {
      const pontoTipo = await this.pontoService.buscarTipo(type);
      if (!pontoTipo) {
        return;
      }
      return pontoTipo;
    }
  }

  @Delete()
  public async remover(@Query('id') id: string) {
    const message = await this.pontoService.remover(id);
    if (!message) {
      return;
    }
    return message;
  }
}
