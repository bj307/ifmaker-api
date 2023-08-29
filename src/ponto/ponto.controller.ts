import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoDTO } from './DTO/ponto.dto';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { AuthService } from 'src/auth/auth.service';
import { verify } from 'jsonwebtoken';
import { RegistrarDTO } from './DTO/registrar.dto';
import { JwtPayload } from 'src/auth/model/jwtpayload.model';
import { AtualizarPontoDTO } from './DTO/atualizaponto.dto';

@Controller('ponto')
export class PontoController {
  constructor(
    private readonly pontoService: PontoService,
    private readonly authService: AuthService,
  ) {}

  @Post('registrar')
  public async registrar(@Request() req, @Body() p: RegistrarDTO) {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;

    const validCode = await this.pontoService.validarCode(p.codigo);

    if(!validCode) {
      throw new NotFoundException('Código invalido ou expirado.');
    }

    const pontoExiste = await this.pontoService.verificarPontoExistente(
      jwtPay.userId,
    );
    if (pontoExiste !== null) {
      const hr = new Date().getHours().toString();
      const min = new Date().getMinutes().toString();
      const seg = new Date().getSeconds().toString();
      const atualizaDTO: AtualizarPontoDTO = {
        saida: `${hr}:${min}:${seg}`,
        atualizacao: p.atualizacao,
      };
      return await this.pontoService.saida(pontoExiste, atualizaDTO);
    } else {
      const hr = new Date().getHours().toString();
      const min = new Date().getMinutes().toString();
      const seg = new Date().getSeconds().toString();
      const dia = new Date().getDate().toString().padStart(2, '0');
      const mes = new Date().getMonth().toString().padStart(2, '0');
      const ano = new Date().getFullYear();
      const pontoDTO: PontoDTO = {
        data: `${dia}/${mes}/${ano}`,
        codigo: p.codigo,
        entrada: `${hr}:${min}:${seg}`,
        saida: null,
        atualizacao: p.atualizacao || null,
        usuario: jwtPay.userId,
      };
      return await this.pontoService.entrada(pontoDTO);
    }
  }

  @Post('gerar-qr')
  @UseGuards(UserRoleGuard)
  public async gerarCode(): Promise<string> {
    return await this.pontoService.gerarCode();
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
  @UseGuards(UserRoleGuard)
  public async remover(@Query('id') id: string) {
    const message = await this.pontoService.remover(id);
    if (!message) {
      return;
    }
    return message;
  }
}
