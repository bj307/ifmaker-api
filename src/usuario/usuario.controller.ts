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
  Request,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CadUsuarioDTO } from './DTO/cadastrar.dto';
import { ShowUsuarioDTO } from './DTO/mostrar.dto';
import { AtUsuarioDTO } from './DTO/atualizar.dto';
import { UserRoleGuard } from 'src/auth/guards/admin-role.guard';
import { AuthService } from 'src/auth/auth.service';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/model/jwtpayload.model';
import { AcessoDTO } from './DTO/nivelacesso.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  @Post('novo')
  @UseGuards(UserRoleGuard)
  public async cadastro(@Body() u: CadUsuarioDTO): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.usuarioService.cadastrar(u);
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Get(':id')
  public async buscarID(@Param('id') id: string): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.usuarioService.buscarID(id);
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Get()
  public async buscarEmail(
    @Query('email') email: string,
  ): Promise<ShowUsuarioDTO> {
    const usuario: ShowUsuarioDTO = await this.usuarioService.buscarEmail(
      email,
    );
    if (!usuario) {
      return;
    }
    return usuario;
  }

  @Put(':id')
  public async atualizar(
    @Request() req,
    @Param('id') id: string,
    @Body() u: AtUsuarioDTO,
  ): Promise<ShowUsuarioDTO> {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
    await this.authService.validateUser(jwtPay);
    if (id !== jwtPay.userId) {
      return;
    }

    const usuario: ShowUsuarioDTO = await this.usuarioService.atualizar(id, u);
    if (!usuario) {
      return;
    }

    return usuario;
  }

  @Delete()
  public async deletar(
    @Request() req,
    @Query('id') id: string,
  ): Promise<string> {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
    await this.authService.validateUser(jwtPay);
    if (id !== jwtPay.userId) {
      return;
    }

    const message = await this.usuarioService.deletar(id);
    if (!message) {
      return;
    }
    return message;
  }

  @Put()
  @UseGuards(UserRoleGuard)
  public async alterarNivelAcesso(
    @Query('user') user: string,
    @Body() acesso: AcessoDTO,
  ) {
    if (acesso.nivel_acesso !== 'admin' && acesso.nivel_acesso !== 'member') {
      console.log(acesso);
      return;
    }
    return await this.usuarioService.alterarNivelAcesso(user, acesso);
  }

  @Post('verify')
  public async validarJwt(@Request() req) {
    const jwtToken = await this.authService.jwtExtractor(req);
    const jwtPay = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
    return await this.authService.validateUser(jwtPay);
  }
}
