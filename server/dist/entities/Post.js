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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const core_1 = require("@mikro-orm/core");
let Post = class Post {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], Post.prototype, "createdAt", void 0);
__decorate([
    core_1.Property({ onUpdate: () => new Date() }),
    __metadata("design:type", Object)
], Post.prototype, "updatedAt", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
Post = __decorate([
    core_1.Entity()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map