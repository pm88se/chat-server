import { registerAs } from '@nestjs/config';

export type SupportedDbType = 'mysql' | 'postgres' | 'mariadb' | 'sqlite';

export const databaseConfig = registerAs('database', () => ({
  type: process.env.DB_TYPE as SupportedDbType,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  name: process.env.DB_NAME || 'nest-chat',
}));
