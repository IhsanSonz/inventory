import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/utils/transform/transform.interceptor';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
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
