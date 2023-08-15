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
} from '@nestjs/common';
import { PontoService } from './ponto.service';
import { PontoDTO } from './DTO/ponto.dto';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { AuthService } from 'src/auth/auth.service';
import { verify } from 'jsonwebtoken';
import { RegistrarDTO } from './DTO/registrar.dto';
import { JwtPayload, QrPayload } from 'src/auth/model/jwtpayload.model';

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

    const payload = verify(p.token, process.env.QR_CODE_SECRET) as QrPayload;
    const pontoDTO: PontoDTO = {
      data: payload.data,
      token: p.token,
      hora: payload.hora,
      tipo: p.tipo,
      atualizacao: p.atualizacao || null,
      usuario: jwtPay.userId,
    };
    console.log(pontoDTO);
    const ponto = await this.pontoService.registrar(pontoDTO);
    if (!ponto) {
      return;
    }
    return ponto;
  }

  @Post('gerar-qr')
  @UseGuards(UserRoleGuard)
  public async gerarQr(): Promise<string> {
    const dia = new Date().getDate().toString().padStart(2, '0');
    const mes = new Date().getMonth().toString().padStart(2, '0');
    const ano = new Date().getFullYear();
    const data = `${dia}/${mes}/${ano}`;
    const hr = new Date().getHours().toString();
    const min = new Date().getMinutes().toString();
    const seg = new Date().getSeconds().toString();
    const hora = `${hr}:${min}:${seg}`;
    const token = await this.pontoService.gerarQr(data, hora);
    if (!token) {
      return;
    }
    return token;
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
