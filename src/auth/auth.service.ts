import { Body, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  @Inject() private readonly usersService: UsersService;
  @Inject() private readonly jwtService: JwtService;

  async validateUser(userId: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserId(userId);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.login(loginDto);
    const payload = {
      sub: user._id,
      username: `${user.name.first} ${user.name.last}`,
      roles: user.roles,
    };
    delete user['_id'];
    return {
      user,
      token: {
        access: this.jwtService.sign(payload),
      },
    };
  }
}
