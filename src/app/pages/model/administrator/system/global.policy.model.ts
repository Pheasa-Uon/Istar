// export interface GlobalPolicyModel {
//     id?: number;
//     policyCode?: string;
//     policyName?: string;
//     validFrom?: Date;
//     validTo?: Date;
//     numberDuplicatedPassword?: number;
//     dayPasswordExpired?: number;
//     minimumPasswordLength?: number;
//     complexedPassword?: boolean;
//     includedLowerCaseLetter?: boolean;
//     includedUpperCaseLetter?: boolean;
//     includedSymbolCharacter?: boolean;
//     includedNumber?: boolean;
//     canLoginFrom?: any;
//     canLoginTo?: any;
//     numberFailedLoginAttempts?: number;
//     description?: string;
// }


export interface BooleanOption {
    value: boolean;
    label: string;
}

export interface GlobalPolicyModel {
    id?: number;
    policy_code?: string;
    policy_name?: string;
    valid_from?: Date;
    valid_to?: Date;
    number_duplicated_password?: number;
    day_password_expired?: number;
    minimum_password_length?: number;
    complexed_password?: BooleanOption;
    included_lower_case_letter?: BooleanOption;
    included_upper_case_letter?: BooleanOption;
    included_symbol_character?: BooleanOption;
    included_number?: BooleanOption;
    can_login_from?: any;
    can_login_to?: any;
    number_failed_login_attempts?: number;
    description?: string;
    status?: boolean;
}
