import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;
}
