import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRoles } from './user.enum';
import { AuthService } from '../auth.service';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from '../model/jwtpayload.model';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request) {
      const jwtToken = await this.authService.jwtExtractor(request);
      console.log();
      const jwtPayload = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
      if (jwtPayload.nivel_acesso === UserRoles.ADMIN) {
        return true;
      } else {
        throw new UnauthorizedException('Acesso não autorizado');
      }
    }

    return false;
  }
}
