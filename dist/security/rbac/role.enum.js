"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
    Role["TEAM_LEAD"] = "team_lead";
    Role["MANAGER"] = "manager";
})(Role || (exports.Role = Role = {}));
var Permission;
(function (Permission) {
    Permission["CREATE_TASK"] = "create:task";
    Permission["READ_TASK"] = "read:task";
    Permission["UPDATE_TASK"] = "update:task";
    Permission["DELETE_TASK"] = "delete:task";
    Permission["MANAGE_USERS"] = "manage:users";
    Permission["MANAGE_TEAMS"] = "manage:teams";
    Permission["VIEW_ANALYTICS"] = "view:analytics";
    Permission["MANAGE_AUTOMATIONS"] = "manage:automations";
    Permission["MANAGE_WEBHOOKS"] = "manage:webhooks";
    Permission["MANAGE_SETTINGS"] = "manage:settings";
})(Permission || (exports.Permission = Permission = {}));
//# sourceMappingURL=role.enum.js.map