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
    canLoginFrom?: any; // e.g., "09:00", "09:00:00"
    canLoginTo?: any;   // e.g., "17:00", "17:00:00"
    numberFailedLoginAttempts?: number;
    description?: string;
}
