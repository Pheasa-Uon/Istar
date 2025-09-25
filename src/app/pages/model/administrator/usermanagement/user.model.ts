export interface StringOption {
    name: string;
    value: string;
}

export interface User {
    id?: number;
    userCode: string;
    username: string;
    name: string;
    password: string;
    email: string;
    userStatus?: StringOption;   // 👈 optional, can be undefined
    description: string;
    lastLoginAt?: string | Date;
}
