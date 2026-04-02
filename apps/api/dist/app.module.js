"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const collections_module_1 = require("./modules/collections/collections.module");
const links_module_1 = require("./modules/links/links.module");
const tags_module_1 = require("./modules/tags/tags.module");
const user_entity_1 = require("./modules/users/entities/user.entity");
const collection_entity_1 = require("./modules/collections/entities/collection.entity");
const link_entity_1 = require("./modules/links/entities/link.entity");
const tag_entity_1 = require("./modules/tags/entities/tag.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('POSTGRES_HOST', 'localhost'),
                    port: config.get('POSTGRES_PORT', 5432),
                    username: config.get('POSTGRES_USER'),
                    password: config.get('POSTGRES_PASSWORD'),
                    database: config.get('POSTGRES_DB'),
                    entities: [user_entity_1.User, collection_entity_1.Collection, link_entity_1.Link, tag_entity_1.Tag],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            collections_module_1.CollectionsModule,
            links_module_1.LinksModule,
            tags_module_1.TagsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map