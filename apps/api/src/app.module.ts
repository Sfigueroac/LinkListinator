import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { LinksModule } from './modules/links/links.module';
import { TagsModule } from './modules/tags/tags.module';
import { User } from './modules/users/entities/user.entity';
import { Collection } from './modules/collections/entities/collection.entity';
import { Link } from './modules/links/entities/link.entity';
import { Tag } from './modules/tags/entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        entities: [User, Collection, Link, Tag],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    CollectionsModule,
    LinksModule,
    TagsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
