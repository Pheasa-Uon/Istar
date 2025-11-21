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
    branch_code?: string;
    branch_name?: string;
    local_branch_name?: string;
    branch_prefix?: string;
    province?: StringOption;
    phone?: string;
    email?: string;
    address?: string;
    isHq?: BooleanOption;
    clone_gl_from_branch?: LongOption;
    online_status?: BooleanOption;
    description?: string;
}

// CurrencyModel dropdown model
export interface DropdownItemBranch {
    id: number;
    label: string;
}
