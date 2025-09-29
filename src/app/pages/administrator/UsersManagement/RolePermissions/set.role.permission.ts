import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { TabViewModule } from 'primeng/tabview';

// ---- Interfaces ----
interface FeaturePermission {
    roleId: number;
    featureId: number;
    featureCode: string;
    isSearch: boolean;
    isAdd: boolean;
    isViewed: boolean;
    isEdit: boolean;
    isApprove: boolean;
    isReject: boolean;
    isDeleted: boolean;
    isSave: boolean;
    isClear: boolean;
    isCancel: boolean;
    isProcess: boolean;
    isImport: boolean;
    isExport: boolean;
    bstatus: boolean;
}

interface MainMenuPermission {
    roleId: number;
    mainMenuId: number;
    isVisible: boolean;
}

interface ReportPermission {
    roleId: number;
    reportId: number;
    reportCode: string;
    isViewed: boolean;
    isExport: boolean;
    bstatus: boolean;
}

interface PermissionResponse {
    featurePermissions: FeaturePermission[];
    mainMenuPermissions: MainMenuPermission[];
    reportPermissions: ReportPermission[];
}

interface CustomTreeNode extends TreeNode {
    selected?: boolean;
}

@Component({
    selector: 'app-set-role-permission',
    standalone: true,
    imports: [CommonModule, FormsModule, TreeTableModule, ButtonModule, HasPermissionDirective, TabViewModule],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Set Role Permission</div>
            <div class="border-t border-gray-200 my-4"></div>
            <div class="card">
                <div class="mb-4 text-lg font-medium text-primary">{{ role?.name || 'Loading...' }}</div>

                <p-tabView [(activeIndex)]="activeTab">
                    <!-- Menu Tab -->
                    <p-tabPanel header="Menu Application">
                        <p-treetable
                            [value]="treeTableValueMenu"
                            [columns]="colsMenu"
                            dataKey="key"
                            [scrollable]="true"
                            [tableStyle]="{ 'min-width': '450px' }">

                            <ng-template pTemplate="header" let-columns>
                                <tr>
                                    <th *ngFor="let col of columns">{{ col.header }}</th>
                                </tr>
                            </ng-template>

                            <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
                                <tr [ttRow]="rowNode">
                                    <td *ngFor="let col of columns; let i = index" style="white-space: nowrap; padding: 5px 10px;">
                                        <ng-container *ngIf="i === 0">
                                            <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                                            <input
                                                type="checkbox"
                                                [(ngModel)]="rowData.isVisible" style="margin-right: 10px;" />
                                            <span *ngIf="rowData.icon" class="pi" [ngClass]="rowData.icon" style="margin-right: 5px;"></span>
                                            {{ rowData.name }}
                                        </ng-container>
                                        <ng-container *ngIf="i === 1">
                                            {{ rowData.description }}
                                        </ng-container>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-treetable>

                    </p-tabPanel>

                    <!-- Application Tab -->
                    <p-tabPanel header="Feature Application">
                        <p-treetable
                            [value]="treeTableValueFeature"
                            [columns]="colsFeature"
                            [scrollable]="true"
                            scrollHeight="475px"
                            [tableStyle]="{ 'min-width': '450px' }">
                            <ng-template pTemplate="header" let-columns>
                                <tr>
                                    <th *ngFor="let col of columns" [style.minWidth.px]="col.minWidth" style="padding: 8px 25px; text-align: left; white-space: nowrap;">
                                        {{ col.header }}
                                    </th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
                                <tr [ttRow]="rowNode">
                                    <td *ngFor="let col of columns; let i = index" [style.minWidth.px]="col.minWidth" style="padding: 8px 25px; white-space: nowrap; text-align: left;">
                                        <ng-container *ngIf="i === 0">
                                            <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                                            {{ rowData[col.field] }}
                                        </ng-container>
                                        <ng-container *ngIf="i === 1">
                                            {{ rowData[col.field] }}
                                        </ng-container>
                                        <ng-container *ngIf="i > 1">
                                            <!-- Hide checkbox for parent nodes with children -->
                                            <input
                                                *ngIf="!hasChildren(rowData); else emptyCell"
                                                type="checkbox"
                                                [(ngModel)]="rowData[col.field]"
                                                [disabled]="rowData[col.field + 'Disabled']" />
                                            <ng-template #emptyCell>
                                                <span></span>
                                            </ng-template>
                                        </ng-container>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-treetable>
                    </p-tabPanel>

                    <!-- Reporting Tab -->
                    <p-tabPanel header="Reporting">
                        <p-treetable
                            [value]="treeTableValueReport"
                            [columns]="colsReport"
                            [scrollable]="true"
                            scrollHeight="475px"
                            [tableStyle]="{ 'min-width': '450px' }">
                            <ng-template pTemplate="header" let-columns>
                                <tr>
                                    <th *ngFor="let col of columns" [style.minWidth.px]="col.minWidth" style="padding: 8px 25px; text-align: left; white-space: nowrap;">
                                        {{ col.header }}
                                    </th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
                                <tr [ttRow]="rowNode">
                                    <td *ngFor="let col of columns; let i = index" [style.minWidth.px]="col.minWidth" style="padding: 8px 25px; white-space: nowrap; text-align: left;">
                                        <ng-container *ngIf="i === 0">
                                            <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                                            {{ rowData[col.field] }}
                                        </ng-container>
                                        <ng-container *ngIf="i === 1">
                                            {{ rowData[col.field] }}
                                        </ng-container>
                                        <ng-container *ngIf="i > 1">
                                            <input *ngIf="!hasChildren(rowData); else emptyCell" type="checkbox" [(ngModel)]="rowData[col.field]" [disabled]="rowData[col.field + 'Disabled']" />
                                            <ng-template #emptyCell>
                                                <span></span>
                                            </ng-template>
                                        </ng-container>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-treetable>
                    </p-tabPanel>
                </p-tabView>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button *hasFeaturePermission="['RLP', 'save']" pButton label="Save" icon="pi pi-save" (click)="saveRolePermission()"></button>
                <button *hasFeaturePermission="['RLP', 'cancel']" pButton label="Cancel" icon="pi pi-times" class="p-button-secondary" (click)="goBack()"></button>
            </div>
        </div>
    `
})
export class SetRolePermission implements OnInit {
    role: any = {};
    roleId = 0;
    treeTableValueMenu: CustomTreeNode[] = [];
    treeTableValueFeature: CustomTreeNode[] = [];
    treeTableValueReport: CustomTreeNode[] = [];
    activeTab = 0;

    colsFeature = [
        { field: 'name', header: 'Feature', minWidth: 200 },
        { field: '', header: '', minWidth: 200 },
        { field: 'isSearch', header: 'Search', minWidth: 25 },
        { field: 'isAdd', header: 'Add', minWidth: 25 },
        { field: 'isViewed', header: 'View', minWidth: 25 },
        { field: 'isEdit', header: 'Edit', minWidth: 25 },
        { field: 'isDeleted', header: 'Delete', minWidth: 25 },
        { field: 'isSave', header: 'Save', minWidth: 25 },
        { field: 'isCancel', header: 'Cancel', minWidth: 25 }
    ];

    colsMenu = [
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' }
    ];

    colsReport = [
        { field: 'name', header: 'Report Name', minWidth: 500 },
        { field: 'description', header: 'Description', minWidth: 500 },
        { field: 'isViewed', header: 'View', minWidth: 25 },
        { field: 'isExport', header: 'Export', minWidth: 25 },
    ];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        this.roleId = Number(this.route.snapshot.paramMap.get('id')) || 0;
        this.loadRole();
        this.loadTreeTable();
    }

    // Helper method to check if a node has children
    hasChildren(rowData: any): boolean {
        return rowData.children && rowData.children.length > 0;
    }

    loadRole() {
        if (this.roleId > 0) {
            this.http.get(`${environment.apiBase}/roles/${this.roleId}`).subscribe({
                next: (res) => (this.role = res),
                error: () => (this.role = { name: 'Unknown Role' })
            });
        } else {
            this.role = { name: 'Unknown Role' };
        }
    }

    loadTreeTable() {
        forkJoin({
            mainmenus: this.http.get<any[]>(`${environment.apiBase}/mainmenu/treetable`),
            features: this.http.get<any[]>(`${environment.apiBase}/features/treetable`),
            reports: this.http.get<any[]>(`${environment.apiBase}/reports/treetable`),
            permissions: this.http.get<PermissionResponse>(`${environment.apiBase}/rolepermissions/role/${this.roleId}`)
        }).subscribe(({ mainmenus, features, reports, permissions }) => {
            this.treeTableValueMenu = this.mapPermissionsMenu(this.convertToTreeNodesMenu(mainmenus), permissions.mainMenuPermissions);
            this.treeTableValueFeature = this.mapPermissionsFeature(this.convertToTreeNodesFeature(features), permissions.featurePermissions);
            this.treeTableValueReport = this.mapPermissionsReport(this.convertToTreeNodesReports(reports), permissions.reportPermissions);
        });
    }

    private convertToTreeNodesFeature(features: any[]): CustomTreeNode[] {
        return features.map(feature => ({
            key: feature.id?.toString(),
            data: {
                ...feature,
                // Add flag to identify parent nodes
                isParent: feature.children && feature.children.length > 0
            },
            children: feature.children ? this.convertToTreeNodesFeature(feature.children) : [],
            expanded: true
        }));
    }

    private convertToTreeNodesMenu(mainmenus: any[]): CustomTreeNode[] {
        return mainmenus.map(menu => ({
            key: menu.id?.toString(),
            data: {
                id: menu.id,
                name: menu.name,
                description: menu.description,
                icon: menu.icon,
                code: menu.code,
                isParent: menu.children && menu.children.length > 0
            },
            children: menu.children ? this.convertToTreeNodesMenu(menu.children) : [],
            expanded: true
        }));
    }

    private convertToTreeNodesReports(reports: any[]): CustomTreeNode[] {
        return reports.map(report => ({
            key: report.id?.toString(),
            data: {
                ...report,
                isParent: report.children && report.children.length > 0
            },
            children: report.children ? this.convertToTreeNodesReports(report.children) : [],
            expanded: true
        }));
    }

    mapPermissionsFeature(features: CustomTreeNode[], featurePermissions: FeaturePermission[]): CustomTreeNode[] {
        const permissionMap = new Map<number, FeaturePermission>();
        featurePermissions.forEach(p => p.featureId && permissionMap.set(p.featureId, p));

        const mapNode = (nodes: CustomTreeNode[]): CustomTreeNode[] =>
            nodes.map(node => {
                const perm = node?.data?.id ? permissionMap.get(node.data.id) : null;
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isSearch: perm?.isSearch ?? false,
                        isAdd: perm?.isAdd ?? false,
                        isViewed: perm?.isViewed ?? false,
                        isEdit: perm?.isEdit ?? false,
                        isDeleted: perm?.isDeleted ?? false,
                        isSave: perm?.isSave ?? false,
                        isCancel: perm?.isCancel ?? false,
                        // Disable permission editing for parent nodes
                        isSearchDisabled: node.data.isParent,
                        isAddDisabled: node.data.isParent,
                        isViewedDisabled: node.data.isParent,
                        isEditDisabled: node.data.isParent,
                        isDeletedDisabled: node.data.isParent,
                        isSaveDisabled: node.data.isParent,
                        isCancelDisabled: node.data.isParent
                    },
                    children: node.children ? mapNode(node.children as CustomTreeNode[]) : []
                };
            });

        return mapNode(features);
    }

    mapPermissionsMenu(mainmenus: CustomTreeNode[], menuPermissions: MainMenuPermission[]): CustomTreeNode[] {
        const permissionMap = new Map<number, MainMenuPermission>();
        menuPermissions.forEach(p => p.mainMenuId && permissionMap.set(p.mainMenuId, p));

        const mapNode = (nodes: CustomTreeNode[]): CustomTreeNode[] =>
            nodes.map(node => {
                const perm = node?.data?.id ? permissionMap.get(node.data.id) : null;
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isVisible: perm?.isVisible ?? false
                    },
                    children: node.children ? mapNode(node.children as CustomTreeNode[]) : [],
                    expanded: true
                };
            });

        return mapNode(mainmenus);
    }

    mapPermissionsReport(reports: CustomTreeNode[], reportPermissions: ReportPermission[]): CustomTreeNode[] {
        const permissionMap = new Map<number, ReportPermission>();
        reportPermissions.forEach(p => p.reportId && permissionMap.set(p.reportId, p));

        const mapNode = (nodes: CustomTreeNode[]): CustomTreeNode[] =>
            nodes.map(node => {
                const perm = node?.data?.id ? permissionMap.get(node.data.id) : null;
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isViewed: perm?.isViewed ?? false,
                        isExport: perm?.isExport ?? false,
                        // Disable permission editing for parent nodes in reports too
                        isViewedDisabled: node.data.isParent,
                        isExportDisabled: node.data.isParent
                    },
                    children: node.children ? mapNode(node.children as CustomTreeNode[]) : []
                };
            });

        return mapNode(reports);
    }

    saveRolePermission() {
        const featurePermissions: any[] = [];
        const mainMenuPermissions: any[] = [];
        const reportPermissions: any[] = [];

        // --- Collect feature permissions ---
        const traverseFeatures = (nodes: CustomTreeNode[]) => {
            for (const node of nodes) {
                const d = node.data;
                if (d?.id && !d.isParent) { // Only collect permissions for non-parent nodes
                    featurePermissions.push({
                        roleId: this.roleId,
                        featureId: d.id,
                        isSearch: !!d.isSearch,
                        isAdd: !!d.isAdd,
                        isViewed: !!d.isViewed,
                        isEdit: !!d.isEdit,
                        isDeleted: !!d.isDeleted,
                        isSave: !!d.isSave,
                        isCancel: !!d.isCancel
                    });
                }
                node.children && traverseFeatures(node.children as CustomTreeNode[]);
            }
        };

        // --- Collect menu permissions ---
        const traverseMenus = (nodes: CustomTreeNode[]) => {
            for (const node of nodes) {
                const d = node.data;
                if (d?.id) {
                    mainMenuPermissions.push({
                        roleId: this.roleId,
                        mainMenuId: d.id,
                        isVisible: !!d.isVisible
                    });
                }
                node.children && traverseMenus(node.children as CustomTreeNode[]);
            }
        };

        // --- Collect report permissions ---
        const traverseReports = (nodes: CustomTreeNode[]) => {
            for (const node of nodes) {
                const d = node.data;
                if (d?.id && !d.isParent) { // Only collect permissions for non-parent nodes
                    reportPermissions.push({
                        roleId: this.roleId,
                        reportId: d.id,
                        isViewed: !!d.isViewed,
                        isExport: !!d.isExport,
                    });
                }
                node.children && traverseReports(node.children as CustomTreeNode[]);
            }
        };

        traverseFeatures(this.treeTableValueFeature);
        traverseMenus(this.treeTableValueMenu);
        traverseReports(this.treeTableValueReport);

        console.log('Feature permissions:', featurePermissions);
        console.log('Menu permissions:', mainMenuPermissions);
        console.log('Report permissions:', reportPermissions);

        // Validate roleId is not null
        if (!this.roleId) {
            alert('Role ID is required!');
            return;
        }

        // Create the payload matching PermissionBulkDTO structure
        const payload = {
            featurePermissions,
            mainMenuPermissions,
            reportPermissions
        };

        this.http.post(`${environment.apiBase}/rolepermissions/bulk`, payload).subscribe({
            next: () => {
                alert('Permissions saved successfully!');
                this.router.navigate(['/role-permission']);
            },
            error: (err) => {
                console.error('Error saving permissions:', err);
                if (err.status === 403) {
                    alert('Access denied. You do not have permission to perform this action.');
                } else {
                    alert('Failed to save permissions. Please try again.');
                }
            }
        });
    }

    goBack() {
        this.router.navigate(['/role-permission']);
    }
}
