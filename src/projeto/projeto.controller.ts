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

  @Get('meus-projetos/:id')
  public async buscarMeusProjetos(@Param('id') id: string): Promise<ProjetoDTO[]> {
    const projetos = await this.projetoService.buscarMeusProjetos(
      id
    );

    return projetos;
  }

  @Get('todos')
  public async buscarTodosProjetos(): Promise<ProjetoDTO[]> {
    const projetos = await this.projetoService.buscarTodosProjetos();

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
