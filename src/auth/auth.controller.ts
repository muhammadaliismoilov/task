import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
        password: { type: 'string', example: 'StrongP@ssw0rd' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi' })
  @ApiResponse({ status: 409, description: 'Email allaqachon mavjud' })
  register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login qilish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@gmail.com' },
        password: { type: 'string', example: 'StrongP@ssw0rd' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login muvaffaqiyatli. Access va Refresh token qaytdi.',
    schema: {
      example: {
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto‘g‘ri' })
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Yangi access token olish (refreshToken orqali)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'jwt-refresh-token' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Yangi access token qaytdi.',
    schema: {
      example: {
        accessToken: 'new-jwt-access-token',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token noto‘g‘ri yoki eskirgan' })
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout - foydalanuvchini tizimdan chiqarish' })
  @ApiResponse({ status: 200, description: 'Tizimdan chiqish muvaffaqiyatli' })
  @ApiResponse({ status: 401, description: 'Token noto‘g‘ri yoki yo‘q' })
  logout(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(req.user.userId, token);
  }
}
