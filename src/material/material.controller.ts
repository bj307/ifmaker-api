import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialDTO } from './DTO/material.dto';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { NovoMaterialDTO } from './DTO/novo.dto';
import { AtualizarMaterialDTO } from './DTO/atualizar.dto';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('novo')
  @UseGuards(UserRoleGuard)
  public async cadastrar(@Body() m: NovoMaterialDTO): Promise<MaterialDTO> {
    const material = await this.materialService.cadastrar(m);
    if (!material) {
      return;
    }
    return material;
  }

  @Get(':id')
  public async buscarID(@Param('id') id: string): Promise<MaterialDTO> {
    const material = await this.materialService.buscarID(id);
    if (!material) {
      return;
    }
    return material;
  }

  @Put()
  @UseGuards(UserRoleGuard)
  public async atualizar(
    @Query('id') id: string,
    @Body() m: AtualizarMaterialDTO,
  ): Promise<MaterialDTO> {
    const material = await this.materialService.atualizar(id, m);
    if (!material) {
      return;
    }
    return material;
  }
}
