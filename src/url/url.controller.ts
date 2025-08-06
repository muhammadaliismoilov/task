
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Res,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('URL')
@Controller()
export class UrlController {
  constructor(private urlService: UrlService) {}

  @Post('shorten')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        originalUrl: { type: 'string', example: 'https://example.com' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Short URL yaratildi' })
  @ApiResponse({ status: 401, description: 'Token noto‘g‘ri yoki mavjud emas' })
  shorten(@Body('originalUrl') url: string, @Req() req) {
    return this.urlService.shorten(url, req.user.userId);
  }

  @Get(':shortCode')
  @ApiParam({ name: 'shortCode', type: 'string', example: 'a1b2c3' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiResponse({ status: 404, description: 'Short URL topilmadi' })
  async redirect(@Param('shortCode') code: string, @Res() res) {
    const original = await this.urlService.redirect(code);
    return res.redirect(original);
  }

  @Get('stats/:shortCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'shortCode', type: 'string', example: 'a1b2c3' })
  @ApiResponse({ status: 200, description: 'URL statistikasi' })
  @ApiResponse({ status: 403, description: 'Siz bu URLga kirish huquqiga ega emassiz' })
  @ApiResponse({ status: 404, description: 'URL topilmadi' })
  stats(@Param('shortCode') code: string, @Req() req) {
    return this.urlService.stats(code, req.user.userId);
  }
}
