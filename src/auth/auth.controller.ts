import { Controller, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/utils/transform/transform.interceptor';
import { AuthService } from './auth.service';

@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}
}
