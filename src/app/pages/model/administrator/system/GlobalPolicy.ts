export interface GlobalPolicy {
    id?: number;
    policyCode?: string;
    policyName?: string;
    validFrom?: Date;
    validTo?: Date;
    numberDuplicatedPassword?: number;
    dayPasswordExpired?: number;
    minimumPasswordLength?: number;
    complexedPassword?: boolean;
    includedLowerCaseLetter?: boolean;
    includedUpperCaseLetter?: boolean;
    includedSymbolCharacter?: boolean;
    includedNumber?: boolean;
    canLoginFrom?: any;
    canLoginTo?: any;
    numberFailedLoginAttempts?: number;
    description?: string;
}
