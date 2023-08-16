import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  Query,
} from '@nestjs/common';
import { AtualizacaoService } from './atualizacao.service';
import { AtualizarDTO } from './DTO/atualizar.dto';
import { AtualizacaoDTO } from './DTO/atualizacao.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/model/jwtpayload.model';
import { verify } from 'jsonwebtoken';

@Controller('atualizacao')
export class AtualizacaoController {
  constructor(
    private readonly atualizacaoService: AtualizacaoService,
    private readonly authService: AuthService,
  ) {}

  @Post('inserir')
  public async atualizar(
    @Request() req,
    @Body() a: AtualizarDTO[],
  ): Promise<AtualizacaoDTO[]> {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
    for (const at of a) {
      at.usuario = jwtPay.userId;
    }
    const atualizacoes = await this.atualizacaoService.atualizar(a);
    if (!atualizacoes) {
      return;
    }

    return atualizacoes;
  }

  @Get(':id')
  public async buscarID(@Param('id') id: string): Promise<AtualizacaoDTO> {
    const atualizacao = await this.atualizacaoService.buscarID(id);
    if (!atualizacao) {
      return;
    }
    return atualizacao;
  }

  @Get()
  public async buscarPorProjeto(
    @Query('id') id: string,
  ): Promise<AtualizacaoDTO[]> {
    const atualizacao = await this.atualizacaoService.buscarPorProjeto(id);
    if (!atualizacao) {
      return;
    }
    return atualizacao;
  }
}
