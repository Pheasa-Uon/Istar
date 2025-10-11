export interface StringOption {
    label: string;
    value: string;
}

export interface User {
    id?: number;
    user_code: string;
    username: string;
    name: string;
    password: string;
    email: string;
    user_status?: StringOption;   // 👈 optional, can be undefined
    description: string;
    last_login_at?: string | Date;
}
