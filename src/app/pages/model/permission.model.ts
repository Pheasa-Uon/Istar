// models/permission.model.ts
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
