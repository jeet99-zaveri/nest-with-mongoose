import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.auth.guard';
import { response } from '../../common/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    if (req.user) {
      const accessToken = await this.authService.generateToken(req.user);
      return response(HttpStatus.OK, 'User logged in successfully.', {
        accessToken,
      });
    } else {
      return response(HttpStatus.UNAUTHORIZED, 'Invalid username or password.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Request() req): Promise<any> {
    return req.user;
  }
}
