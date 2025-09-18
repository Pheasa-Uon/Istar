export interface RolePermission {
    id: number; // roleId
    name: string;
    description?: string;
    rolesStatus?: string;
    checked?: boolean; // bound to checkbox
}
