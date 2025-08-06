import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'newuser@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'mySecret123', description: 'Parol (kamida 6 ta belgidan iborat)' })
  password: string;
}
