export interface DepartmentModel {
    id?: number | undefined;
    department_code?: string;
    department_name?: string;
    description?: string;
}

export interface DropdownItemDepartment {
    id: number;
    code: string;
    department_label: string;
}
