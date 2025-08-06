import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    await this.userModel.create({ email, password: hashed });
    return { message: 'User registered' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException();
    const accessToken = this.jwtService.sign(
      { sub: user._id },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user._id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
    user.refreshTokens.push(refreshToken);
    await user.save();
    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.refreshTokens.includes(token))
        throw new UnauthorizedException();
      const newAccessToken = this.jwtService.sign(
        { sub: user._id },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logout(userId: string, token: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: token },
    });
    return { message: 'Logged out' };
  }
}
