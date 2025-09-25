export interface StringOption {
    name: string;
    value: string;
}

export interface RolePermission {
    id?: number | undefined;
    roleCode?: string;
    roleName?: string;
    roleStatus?: StringOption;
    description: string;
    checked?: boolean;
}
