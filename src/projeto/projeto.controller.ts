import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjetoService } from './projeto.service';
import { ProjetoDTO } from './DTO/projeto.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { AtualizarProjetoDTO } from './DTO/atualizarprojeto.dto';
import { JwtPayload } from 'src/auth/model/jwtpayload.model';
import { verify } from 'jsonwebtoken';

@Controller('projeto')
export class ProjetoController {
  constructor(
    private readonly projetoService: ProjetoService,
    private readonly authService: AuthService,
  ) {}

  @Post('novo')
  @UseGuards(UserRoleGuard)
  public async cadastrar(@Body() p: ProjetoDTO): Promise<ProjetoDTO> {
    return await this.projetoService.cadastrar(p);
  }

  @Get('id')
  public async buscarID(@Param('id') id: string): Promise<ProjetoDTO> {
    const projeto = await this.projetoService.buscarID(id);
    if (!projeto) {
      return;
    }

    return projeto;
  }

  @Get('meus-projetos')
  public async buscarMeusProjetos(@Request() req): Promise<ProjetoDTO[]> {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
    await this.authService.validateUser(jwtPay);
    const projetos = await this.projetoService.buscarMeusProjetos(
      jwtPay.userId,
    );

    return projetos;
  }

  @Put(':id')
  @UseGuards(UserRoleGuard)
  public async atualizar(
    @Param('id') id: string,
    @Body() p: AtualizarProjetoDTO,
  ): Promise<ProjetoDTO> {
    return await this.projetoService.atualizar(id, p);
  }
}
