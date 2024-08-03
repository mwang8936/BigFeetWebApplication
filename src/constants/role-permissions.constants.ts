import { Permissions, Role } from '../models/enums';

const rolePermissions: Map<Role, Permissions[]> = new Map();

export const permissionValues = Object.values(Permissions).map(
	(permission: Permissions) => permission
);

rolePermissions.set(Role.DEVELOPER, permissionValues);
rolePermissions.set(Role.MANAGER, permissionValues);
rolePermissions.set(Role.OTHER, permissionValues);
rolePermissions.set(Role.RECEPTIONIST, [
	Permissions.PERMISSION_GET_CUSTOMER,
	Permissions.PERMISSION_UPDATE_CUSTOMER,
	Permissions.PERMISSION_ADD_CUSTOMER,
	Permissions.PERMISSION_GET_EMPLOYEE,
	Permissions.PERMISSION_GET_GIFT_CARD,
	Permissions.PERMISSION_UPDATE_GIFT_CARD,
	Permissions.PERMISSION_ADD_GIFT_CARD,
	Permissions.PERMISSION_DELETE_GIFT_CARD,
	Permissions.PERMISSION_GET_SCHEDULE,
	Permissions.PERMISSION_UPDATE_SCHEDULE,
	Permissions.PERMISSION_ADD_SCHEDULE,
	Permissions.PERMISSION_GET_SERVICE,
	Permissions.PERMISSION_GET_RESERVATION,
	Permissions.PERMISSION_UPDATE_RESERVATION,
	Permissions.PERMISSION_ADD_RESERVATION,
	Permissions.PERMISSION_DELETE_RESERVATION,
	Permissions.PERMISSION_GET_VIP_PACKAGE,
	Permissions.PERMISSION_UPDATE_VIP_PACKAGE,
	Permissions.PERMISSION_ADD_VIP_PACKAGE,
	Permissions.PERMISSION_DELETE_VIP_PACKAGE,
]);
rolePermissions.set(Role.STORE_EMPLOYEE, [
	Permissions.PERMISSION_GET_CUSTOMER,
	Permissions.PERMISSION_GET_SERVICE,
	Permissions.PERMISSION_GET_VIP_PACKAGE,
]);

export default rolePermissions;
