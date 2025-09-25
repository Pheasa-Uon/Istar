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
    name: string;
}

export interface GlobalPolicyModel {
    id?: number;
    policyCode?: string;
    policyName?: string;
    validFrom?: Date;
    validTo?: Date;
    numberDuplicatedPassword?: number;
    dayPasswordExpired?: number;
    minimumPasswordLength?: number;
    complexedPassword?: BooleanOption;
    includedLowerCaseLetter?: BooleanOption;
    includedUpperCaseLetter?: BooleanOption;
    includedSymbolCharacter?: BooleanOption;
    includedNumber?: BooleanOption;
    canLoginFrom?: any;
    canLoginTo?: any;
    numberFailedLoginAttempts?: number;
    description?: string;
    bstatus?: boolean;
}
