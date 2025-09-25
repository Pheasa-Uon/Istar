export interface StringOption {
    value: string;
    label: string;
}

export interface GlobalSystemParameter {
    id?: number;
    sysParCode?: string;
    moduleName?: StringOption;
    fieldName?: StringOption;
    valueName?: string;
    localValueName?: string;
    displayOrder?: number;
    sysParStatus?: StringOption;
    description?: string;
    bstatus?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
