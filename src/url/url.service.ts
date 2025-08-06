

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './schema/url.schema';
import * as crypto from 'crypto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

  async shorten(originalUrl: string, userId: string) {
    const shortCode = crypto.randomBytes(3).toString('hex');
    const shortUrl = `http://localhost:3000/${shortCode}`;
    await this.urlModel.create({ originalUrl, shortCode, userId });
    return { shortCode, shortUrl };
  }

  async redirect(shortCode: string) {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) {
      throw new NotFoundException('Bunday shortCode mavjud emas');
    }
    url.visits++;
    await url.save();
    return url.originalUrl;
  }

  async stats(shortCode: string, userId: string) {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) {
      throw new NotFoundException('URL topilmadi');
    }
    if (url.userId !== userId) {
      throw new ForbiddenException('Siz bu URLga kirish huquqiga ega emassiz');
    }
    return {
      originalUrl: url.originalUrl,
      visits: url.visits,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    };
  }
}
