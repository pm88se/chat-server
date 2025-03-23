import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nest-chat',

  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations_history',
});
