import { Role, Permission } from './role.enum';
export declare const ROLES_KEY = "roles";
export declare const PERMISSIONS_KEY = "permissions";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const Permissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
