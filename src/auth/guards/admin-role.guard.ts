import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      const jwtPayload = verify(jwtToken, process.env.JWT_SECRET) as JwtPayload;
      return jwtPayload.nivel_acesso === UserRoles.ADMIN;
    }

    return false;
  }
}
