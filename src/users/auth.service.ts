import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // check email is exist before (unique)
    const users = await this.userService.find(email);
    if (users.length) throw new BadRequestException('this email found before');
    // hash password
    // 1- generate salt
    const salt = randomBytes(8).toString('hex');
    // 2- hash password with salt
    const hashed = (await scrypt(password, salt, 32)) as Buffer;
    // 3- join hashed.salt
    const result = salt + '&' + hashed.toString('hex');
    // create user entity and save it
    const user = await this.userService.create(email, result);
    // return the saved user
    return user;
  }

  async signIn(email: string, password: string) {
    // get user based on email
    const [user] = await this.userService.find(email);
    if (!user) throw new BadRequestException('this user is not found');
    // get the stored password and salt
    const [salt, storedPassword] = user.password.split('&');

    // hash the input password with the salt
    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;
    // compare the result with the stored password
    if (storedPassword !== hashedPassword.toString('hex'))
      throw new ForbiddenException('incorrect email or password , try again');
    return user;
  }
}
