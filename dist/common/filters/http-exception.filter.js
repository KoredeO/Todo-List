"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
let AllExceptionsFilter = class AllExceptionsFilter {
    logger = new common_1.Logger('ExceptionFilter');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();
            message = response.message || exception.message;
            error = response.error || 'Error';
        }
        else if (exception instanceof mongoose_1.default.Error.ValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = Object.values(exception.errors)
                .map(err => err.message)
                .join(', ');
            error = 'Validation Error';
        }
        else if (exception instanceof mongoose_1.default.Error.CastError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = 'Invalid ID format';
            error = 'Cast Error';
        }
        else if (exception instanceof mongodb_1.MongoError) {
            if (exception.code === 11000) {
                status = common_1.HttpStatus.CONFLICT;
                message = 'Duplicate key error';
                error = 'Conflict';
            }
        }
        this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : 'No stack trace', 'ExceptionFilter');
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error,
            message,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map