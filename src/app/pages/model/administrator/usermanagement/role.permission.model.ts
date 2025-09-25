export interface StringOption {
    name: string;
    value: string;
}

export interface RolePermissionModel {
    id?: number | undefined;
    roleCode?: string;
    roleName?: string;
    roleStatus?: StringOption;
    description: string;
    checked?: boolean;
}
