export interface LongOption {
    value: number;
    label: string;
}

export interface BooleanOption {
    value: boolean;
    label: string;
}

export interface StringOption {
    value: string;
    label: string;
}

export interface BranchModel {
    id?: number | undefined;
    branchCode?: string;
    branchName?: string;
    localBranchName?: string;
    branchPrefix?: string;
    province?: StringOption;
    phone?: string;
    email?: string;
    address?: string;
    isHq?: BooleanOption;
    cloneGlFromBranch?: LongOption;
    onlineStatus?: BooleanOption;
    description?: string;
}

// CurrencyModel dropdown model
export interface DropdownItemBranch {
    id: number;
    label: string;
}

// Province dropdown model
export interface DropdownItemProvince {
    sysParCode: string;
    valueName: string;
}
