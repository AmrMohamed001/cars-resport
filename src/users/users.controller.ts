import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from './users.entity';
import {
  serialize,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from './auth.service';
import { currentUser } from './decorators/current-user.decorator';

import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';


@Controller('auth')
@serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signupUser(@Body() body: CreateUserDto, @Session() Session: any) {
    const user = await this.authService.signup(body.email, body.password);
    Session.userId = user.id;
    return user;
  }
  @Post('/signin')
  async loginUser(@Body() body: CreateUserDto, @Session() Session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    Session.userId = user.id;
    return user;
  }

  // using session cookie
  @Get('/whoami')
  async whoAmI(@Session() session: any) {
    const user = await this.userService.findOne(session.userId);
    if (!user) throw new NotFoundException('this user is not login');
    return user;
  }

  // using custom decorator and interceptor
  @Get('me')
  @UseGuards(AuthGuard)
  current(@currentUser() user: User) {
    return user;
  }

  @Get('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  // @UseInterceptors(ClassSerializerInterceptor) // nest docs recommendations
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    console.log(user);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() Body: UpdateUserDto) {
    return this.userService.update(parseInt(id), Body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    this.userService.remove(parseInt(id));
  }
}
