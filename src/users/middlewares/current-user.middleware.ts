import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  use(req: any, res: any, next: (error?: Error | any) => void) {
    const { userId } = req.session;
    if (userId) {
      const user = this.userService.findOne(userId);
      req.user = user;
    }
    next();
  }
}
