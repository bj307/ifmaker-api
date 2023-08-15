import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjetoService } from './projeto.service';
import { ProjetoDTO } from './DTO/projeto.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/model/jwtpayload.model';
import { verify } from 'jsonwebtoken';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';

@Controller('projeto')
export class ProjetoController {
  constructor(
    private readonly projetoService: ProjetoService,
    private readonly authService: AuthService,
  ) {}

  @Post('novo')
  @UseGuards(UserRoleGuard)
  public async cadastrar(
    @Request() req,
    @Body() p: ProjetoDTO,
  ): Promise<ProjetoDTO> {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
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

  @Put(':id')
  @UseGuards(UserRoleGuard)
  public async atualizar(
    @Param('id') id: string,
    @Body() p: ProjetoDTO,
  ): Promise<ProjetoDTO> {
    return await this.projetoService.atualizar(id, p);
  }
}
