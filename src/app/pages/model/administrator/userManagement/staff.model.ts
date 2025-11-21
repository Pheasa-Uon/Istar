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

export interface StaffModel {
    id?: number | undefined;
    employee_code?: string;
    employee_name?: string;
    local_employee_name?: string;
    gender?: LongOption;
    identity_type?: LongOption;
    identity_number?: string;
    valid_from?: Date;
    valid_to?: Date;
    issue_by?: LongOption;
    date_of_birth?: Date;
    job_title?: string;
    report_to?: LongOption;
    phone_number1?: string;
    phone_number2?: string;
    email?: string;
    department?: LongOption;
    position?: LongOption;
    employee_type?: LongOption;
    marital_status?: LongOption;
    working_status?: LongOption;
    province?: LongOption;
    district?: LongOption;
    commune?: LongOption;
    village?: LongOption;
    address_detail?: string;
    start_working_date?: Date;
    current_salary?: number;
    description?: string;
    created_by?: number | undefined;
    updated_by?: number | undefined;
    status?: boolean;
    branch?: LongOption;
    created_at?: string;
    updated_at?: string;
}



// CurrencyModel dropdown model
export interface DropdownItemStaff {
    id: number;
    label: string;
}
