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
exports.RBACGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let RBACGuard = class RBACGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        const requiredPermissions = this.reflector.get('permissions', context.getHandler());
        if (!requiredRoles && !requiredPermissions) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }
        if (requiredRoles && !this.matchRoles(requiredRoles, user.roles)) {
            return false;
        }
        if (requiredPermissions && !this.matchPermissions(requiredPermissions, user.permissions)) {
            return false;
        }
        return true;
    }
    matchRoles(required, userRoles) {
        return required.some(role => userRoles.includes(role));
    }
    matchPermissions(required, userPermissions) {
        return required.every(permission => userPermissions.includes(permission));
    }
};
exports.RBACGuard = RBACGuard;
exports.RBACGuard = RBACGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RBACGuard);
//# sourceMappingURL=rbac.guard.js.map