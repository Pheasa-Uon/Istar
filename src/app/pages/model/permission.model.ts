// models/permission.model.ts
export type Action = 'SEARCH' | 'ADD' | 'VIEW' | 'EDIT' | 'APPROVE' | 'REJECT' | 'DELETED' | 'SAVE' | 'CLEAR' | 'CANCEL' | 'PROCESS' | 'IMPORT' | 'EXPORT';
export interface PermissionFlags {
    search?: boolean;
    add?: boolean;
    view?: boolean;
    edit?: boolean;
    approve?: boolean;
    reject?: boolean;
    deleted?: boolean;
    save?: boolean;
    clear?: boolean;
    cancel?: boolean;
    process?: boolean;
    imported?: boolean;
    exported?: boolean;
}
export type PermissionMap = {
    [featureCode: string]: PermissionFlags;
}

export interface RoleFeaturePermission {
    id?: number;
    roleId: number;
    featureId: number;
    featureCode: string;
    isSearch?: boolean;
    isAdd?: boolean;
    isViewed?: boolean;
    isEdit?: boolean;
    isApprove?: boolean;
    isReject?: boolean;
    isDeleted?: boolean;
    isSave?: boolean;
    isClear?: boolean;
    isCancel?: boolean;
    isProcess?: boolean;
    isImport?: boolean;
    isExport?: boolean;
}
