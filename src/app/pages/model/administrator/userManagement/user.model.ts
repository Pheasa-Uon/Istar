export interface StringOption {
    label: string;
    value: string;
}

export interface UserResponse {
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

export interface UserRequest {
    id?: number;
    user_code: string;
    username: string;
    name: string;
    password: string;
    email: string;
    user_status?: string;   // 👈 optional, can be undefined
    description: string;
    last_login_at?: string | Date;
}
