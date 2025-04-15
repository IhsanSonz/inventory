import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/utils/transform/transform.interceptor';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { AccessTokenGuard } from 'src/common/access-token/access-token.guard';
import { Request } from 'express';

@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return {
      result: await this.authService.register(registerDto),
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return {
      result: await this.authService.login(loginDto),
    };
  }

  @Get('user')
  @UseGuards(AccessTokenGuard)
  async user(@Req() req: Request): Promise<any> {
    if (!req.user || !req.user['sub']) {
      throw new BadRequestException('empty jwt payload.');
    }

    return {
      result: await this.authService.user(req.user['sub'] as string),
    };
  }
}
