import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { response } from '../../common/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        return response(
          HttpStatus.UNAUTHORIZED,
          'Invalid email ID or password',
        );
      }
      return user;
    }

    return null;
  }

  async generateToken(user: any) {
    return this.jwtService.sign({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
    });
  }
}
