export interface StringOption {
    value: string;
    label: string;
}

export interface SystemParameterModel {
    id?: number | undefined;
    parameterModule?: StringOption;
    parameterName: string;
    parameterValue: string;
    description: string;
}
