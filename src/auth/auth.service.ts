import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

interface AuthInterface {
  user: UserDocument;
  tokens: { accessToken: string; refreshToken: string };
}
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthInterface> {
    const checkUser = await this.findUserByEmail(registerDto.email);
    if (checkUser) {
      throw new BadRequestException('Email already in use.');
    }

    const usernameSalt = Math.floor(100000 + Math.random() * 900000);
    registerDto.username = 'user.' + usernameSalt;
    const user = new this.userModel(registerDto);
    await user.save();

    const tokens = await this.createAccessToken(
      user._id.toString(),
      user.username,
    );
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return {
      user,
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthInterface> {
    const user = await this.findUserByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('Wrong email or password.');
    }

    await this.checkPassword(loginDto.password, user);

    const tokens = await this.createAccessToken(
      user._id.toString(),
      user.username,
    );
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async user(userId: string): Promise<{
    user: UserDocument;
  }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('No user found.');
    }

    return {
      user,
    };
  }

  private async findUserByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  private async checkPassword(attemptPass: string, user: UserDocument) {
    const match = await bcrypt.compare(attemptPass, user.password || '');
    if (!match) {
      throw new NotFoundException('Wrong email or password.');
    }
    return match;
  }

  private async createAccessToken(userId: string, username: string) {
    const payload = { sub: userId, username };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.findOneAndUpdate({ _id: userId }, { refreshToken });
  }
}
