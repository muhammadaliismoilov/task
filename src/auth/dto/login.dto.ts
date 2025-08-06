import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Foydalanuvchining email manzili' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Foydalanuvchining paroli' })
  password: string;
}
