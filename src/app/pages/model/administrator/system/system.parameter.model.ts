export interface StringOption {
    value: string;
    label: string;
}

export interface SystemParameterModel {
    id?: number | undefined;
    parameter_module?: StringOption;
    parameter_name: string;
    parameter_value: string;
    description: string;
}
