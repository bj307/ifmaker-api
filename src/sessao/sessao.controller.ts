import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { SessaoService } from './sessao.service';
import { LoginDTO } from './DTO/login.dto';

@Controller('sessao')
export class SessaoController {
  constructor(private readonly sessaoService: SessaoService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async login( 
    @Body()
    login: LoginDTO,
  ): Promise<{ id: string; nome: string; jwtToken: string; email: string }> {
    return await this.sessaoService.login(login);
  }
}
