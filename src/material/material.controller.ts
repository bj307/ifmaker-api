import { Controller, Post, Get, Put, Param, Body, Query } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialDTO } from './DTO/material.dto';

@Controller('material')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) {}

    @Post('novo')
    public async cadastrar(@Body() m: MaterialDTO): Promise<MaterialDTO> {
        const material = await this.materialService.cadastrar(m);
        if(!material) {
            return;
        }
        return material;
    }

    @Get(':id')
    public async buscarID(@Param('id') id: string): Promise<MaterialDTO> {
        const material = await this.materialService.buscarID(id);
        if(!material) {
            return;
        }
        return material;
    }

    @Put()
    public async atualizar(@Query('id') id: string, @Body() m: MaterialDTO): Promise<MaterialDTO> {
        const material = await this.materialService.atualizar(id, m);
        if(!material) {
            return;
        }
        return material;
    }
}
