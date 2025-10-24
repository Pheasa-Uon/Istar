export interface StringOption {
    value: string;
    label: string;
}

export interface GlobalSystemParameter {
    id?: number;
    sys_par_code?: string;
    module_name?: StringOption;
    field_name?: StringOption;
    value_name?: string;
    local_value_name?: string;
    display_order?: number;
    sys_par_status?: StringOption;
    description?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

// All Use dropdown model
export interface DropdownItemGlobalSystemParameter {
    sysParCode: string;
    valueName: string;
}
