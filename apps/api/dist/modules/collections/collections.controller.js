"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsController = void 0;
const common_1 = require("@nestjs/common");
const collections_service_1 = require("./collections.service");
const create_collection_dto_1 = require("./dto/create-collection.dto");
const update_collection_dto_1 = require("./dto/update-collection.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CollectionsController = class CollectionsController {
    collectionsService;
    constructor(collectionsService) {
        this.collectionsService = collectionsService;
    }
    findMine(user) {
        return this.collectionsService.findMine(user.id);
    }
    findPublic(page = 1, limit = 20) {
        return this.collectionsService.findPublic(+page, +limit);
    }
    findOne(id, user) {
        return this.collectionsService.findOne(id, user?.id);
    }
    create(user, dto) {
        return this.collectionsService.create(user.id, dto);
    }
    update(id, user, dto) {
        return this.collectionsService.update(id, user.id, dto);
    }
    remove(id, user) {
        return this.collectionsService.remove(id, user.id);
    }
};
exports.CollectionsController = CollectionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findMine", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_collection_dto_1.CreateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_collection_dto_1.UpdateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "remove", null);
exports.CollectionsController = CollectionsController = __decorate([
    (0, common_1.Controller)('collections'),
    __metadata("design:paramtypes", [collections_service_1.CollectionsService])
], CollectionsController);
//# sourceMappingURL=collections.controller.js.map