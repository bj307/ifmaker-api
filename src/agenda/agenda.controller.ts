import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { AgendaDTO } from './DTO/agenda.dto';
import { EditarAgendadoDTO } from './DTO/atualizaragenda.dto';

@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly agendaService: AgendaService,
    private readonly authService: AuthService,
  ) {}

  @Post('novo')
  @UseGuards(UserRoleGuard)
  public async agendar(@Body() a: AgendaDTO): Promise<AgendaDTO> {
    const agenda: AgendaDTO = await this.agendaService.agendar(a);
    if (!agenda) {
      return;
    }
    return agenda;
  }

  @Get(':id')
  public async buscarID(@Param('id') id: string): Promise<AgendaDTO> {
    const agenda: AgendaDTO = await this.agendaService.buscarID(id);
    if (!agenda) {
      return;
    }
    return agenda;
  }

  @Get()
  public async buscarMes(@Query('mes') mes: number): Promise<AgendaDTO[]> {
    const agendados: AgendaDTO[] = await this.agendaService.buscarMes(mes);
    if (agendados.length == 0) {
      return;
    }
    return agendados;
  }

  @Put(':id')
  @UseGuards(UserRoleGuard)
  public async atualizar(
    @Param('id') id: string,
    @Body() a: EditarAgendadoDTO,
  ): Promise<AgendaDTO> {
    const agenda = await this.agendaService.atualizar(id, a);
    if (!agenda) {
      return;
    }
    return agenda;
  }

  @Delete()
  @UseGuards(UserRoleGuard)
  public async remover(@Query('id') id: string): Promise<string> {
    const message = await this.agendaService.remover(id);
    if (!message) {
      return;
    }
    return message;
  }
}
