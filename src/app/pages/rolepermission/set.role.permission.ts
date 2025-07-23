import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-set-role-permission',
    standalone: true,
    imports: [CommonModule, FormsModule, TreeTableModule, ButtonModule],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Set Role Permission</div>
            <div class="mb-4 text-lg font-medium text-primary">{{ role?.name || 'Loading...' }}</div>

            <p-treetable
                [value]="treeTableValue"
                [columns]="cols"
                [scrollable]="true"
                scrollHeight="475px"
                [tableStyle]="{ 'min-width': '1000px' }"
            >
                <ng-template pTemplate="header" let-columns>
                    <tr>
                        <th *ngFor="let col of columns"
                            [style.minWidth.px]="col.minWidth"
                            style="padding: 8px 25px; text-align: center; white-space: nowrap;">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-rowNode let-rowData="rowData" let-columns="columns">
                    <tr [ttRow]="rowNode">
                        <td *ngFor="let col of columns; let i = index"
                            [style.minWidth.px]="col.minWidth"
                            style="padding: 8px 25px; white-space: nowrap;">
                            <ng-container *ngIf="i === 0">
                                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                                {{ rowData[col.field] }}
                            </ng-container>

                            <ng-container *ngIf="i === 1">
                                {{ rowData[col.field] }}
                            </ng-container>

                            <ng-container *ngIf="i > 1">
                                <input type="checkbox"
                                       [(ngModel)]="rowData[col.field]"
                                       [disabled]="rowData[col.field + 'Disabled']" />
                            </ng-container>
                        </td>
                    </tr>
                </ng-template>
            </p-treetable>

            <div class="flex justify-end gap-2 mt-6">
                <button pButton label="Save" icon="pi pi-save" (click)="saveRolePermission()"></button>
                <button pButton label="Cancel" icon="pi pi-times" class="p-button-secondary" (click)="goBack()"></button>
            </div>
        </div>
    `
})
export class SetRolePermission implements OnInit {
    role: any = {};
    roleId = 0;
    treeTableValue: TreeNode[] = [];

    cols = [
        { field: 'name', header: 'Feature', minWidth: 200 },
        { field: '', header: '', minWidth: 200 },
        { field: 'isSearch', header: 'Search', minWidth: 25 },
        { field: 'isAdd', header: 'Add', minWidth: 25 },
        { field: 'isViewed', header: 'View', minWidth: 25 },
        { field: 'isEdit', header: 'Edit', minWidth: 25 },
        //{ field: 'isApprove', header: 'Approve', minWidth: 25 },
        //{ field: 'isReject', header: 'Reject', minWidth: 25 },
        { field: 'isDeleted', header: 'Delete', minWidth: 25 },
        { field: 'isSave', header: 'Save', minWidth: 25 },
        { field: 'isClear', header: 'Clear', minWidth: 25 },
        { field: 'isCancel', header: 'Cancel', minWidth: 25 },
        //{ field: 'isProcess', header: 'Process', minWidth: 25 },
        //{ field: 'isImport', header: 'Import', minWidth: 25 },
        //{ field: 'isExport', header: 'Export', minWidth: 25 }
    ];

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.roleId = Number(this.route.snapshot.paramMap.get('id')) || 0;
        this.loadRole();
        this.loadTreeTable();
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
            features: this.http.get<any[]>(`${environment.apiBase}/features/treetable`),
            selectedPermissions: this.http.get<any[]>(`${environment.apiBase}/permissions/role/${this.roleId}`)
        }).subscribe(({ features, selectedPermissions }) => {
            const featureTree = this.convertToTreeNodes(features);
            this.treeTableValue = this.mapPermissions(featureTree, selectedPermissions);
        });
    }

    private convertToTreeNodes(features: any[]): TreeNode[] {
        return features.map((feature) => ({
            key: feature.id?.toString(),
            data: {
                id: feature.id,
                name: feature.name,
                code: feature.code,
                type: feature.type,
                routePath: feature.routePath,
                icon: feature.icon,
                order: feature.order,
                bStatus: feature.bStatus
            },
            children: feature.children ? this.convertToTreeNodes(feature.children) : [],
            expanded: true
        }));
    }

    mapPermissions(features: TreeNode[], selectedPermissions: any[]): TreeNode[] {
        const permissionMap = new Map<number, any>();
        selectedPermissions.forEach((p) => {
            permissionMap.set(p.feature.id, p);
        });

        const mapNode = (nodes: TreeNode[]): TreeNode[] =>
            nodes.map((node) => {
                const perm = permissionMap.get(node.data.id);
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isSearch: perm?.isSearch ?? false,
                        isAdd: perm?.isAdd ?? false,
                        isViewed: perm?.isViewed ?? false,
                        isEdit: perm?.isEdit ?? false,
                        isApprove: perm?.isApprove ?? false,
                        isReject: perm?.isReject ?? false,
                        isDeleted: perm?.isDeleted ?? false,
                        isSave: perm?.isSave ?? false,
                        isClear: perm?.isClear ?? false,
                        isCancel: perm?.isCancel ?? false,
                        isProcess: perm?.isProcess ?? false,
                        isImport: perm?.isImport ?? false,
                        isExport: perm?.isExport ?? false,

                        // disable flags
                        isSearchDisabled: perm?.isSearchDisabled ?? false,
                        isAddDisabled: perm?.isAddDisabled ?? false,
                        isViewedDisabled: perm?.isViewedDisabled ?? false,
                        isEditDisabled: perm?.isEditDisabled ?? false,
                        isApproveDisabled: perm?.isApproveDisabled ?? false,
                        isRejectDisabled: perm?.isRejectDisabled ?? false,
                        isDeletedDisabled: perm?.isDeletedDisabled ?? false,
                        isSaveDisabled: perm?.isSaveDisabled ?? false,
                        isClearDisabled: perm?.isClearDisabled ?? false,
                        isCancelDisabled: perm?.isCancelDisabled ?? false,
                        isProcessDisabled: perm?.isProcessDisabled ?? false,
                        isImportDisabled: perm?.isImportDisabled ?? false,
                        isExportDisabled: perm?.isExportDisabled ?? false
                    },
                    children: node.children ? mapNode(node.children) : []
                };
            });

        return mapNode(features);
    }

    saveRolePermission() {
        const payload: any[] = [];

        const traverse = (nodes: TreeNode[]) => {
            for (const node of nodes) {
                const d = node.data;
                if (d && d.id) {
                    payload.push({
                        roleId: this.roleId,
                        featureId: d.id,
                        isSearch: !!d.isSearch,
                        isAdd: !!d.isAdd,
                        isViewed: !!d.isViewed,
                        isEdit: !!d.isEdit,
                        isApprove: !!d.isApprove,
                        isReject: !!d.isReject,
                        isDeleted: !!d.isDeleted,
                        isSave: !!d.isSave,
                        isClear: !!d.isClear,
                        isCancel: !!d.isCancel,
                        isProcess: !!d.isProcess,
                        isImport: !!d.isImport,
                        isExport: !!d.isExport
                    });
                }
                if (node.children) {
                    traverse(node.children);
                }
            }
        };

        traverse(this.treeTableValue);

        this.http.post(`${environment.apiBase}/permissions/bulk`, payload).subscribe({
            next: () => {
                alert('Permissions saved successfully!');
                this.router.navigate(['/rolepermission']);
            },
            error: (err) => {
                alert('Failed to save permissions. Please try again.');
                console.error(err);
            }
        });
    }

    goBack() {
        this.router.navigate(['/rolepermission']);
    }
}
