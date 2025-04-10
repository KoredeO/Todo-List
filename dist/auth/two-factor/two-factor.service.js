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
exports.TwoFactorService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const qrcode = require("qrcode");
let TwoFactorService = class TwoFactorService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async generateSecret(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const secret = otplib_1.authenticator.generateSecret();
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.email, 'TodoApp', secret);
        const qrCode = await qrcode.toDataURL(otpAuthUrl);
        await this.userModel.updateOne({ _id: userId }, {
            $set: {
                twoFactorSecret: secret,
                twoFactorEnabled: false,
            },
        });
        return {
            secret,
            otpAuthUrl,
            qrCode,
        };
    }
    async verifyCode(userId, code) {
        const user = await this.userModel.findById(userId);
        if (!user?.twoFactorSecret) {
            return false;
        }
        return otplib_1.authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });
    }
    async enableTwoFactor(userId, code) {
        const isValid = await this.verifyCode(userId, code);
        if (isValid) {
            await this.userModel.updateOne({ _id: userId }, { $set: { twoFactorEnabled: true } });
            return true;
        }
        return false;
    }
    async disableTwoFactor(userId, code) {
        const isValid = await this.verifyCode(userId, code);
        if (isValid) {
            await this.userModel.updateOne({ _id: userId }, {
                $set: { twoFactorEnabled: false },
                $unset: { twoFactorSecret: 1 },
            });
            return true;
        }
        return false;
    }
    async generateBackupCodes(userId) {
        const codes = Array.from({ length: 10 }, () => Math.random().toString(36).substr(2, 8).toUpperCase());
        await this.userModel.updateOne({ _id: userId }, { $set: { backupCodes: codes } });
        return codes;
    }
    async verifyBackupCode(userId, code) {
        const user = await this.userModel.findById(userId);
        if (!user?.backupCodes?.includes(code)) {
            return false;
        }
        await this.userModel.updateOne({ _id: userId }, { $pull: { backupCodes: code } });
        return true;
    }
};
exports.TwoFactorService = TwoFactorService;
exports.TwoFactorService = TwoFactorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TwoFactorService);
//# sourceMappingURL=two-factor.service.js.map