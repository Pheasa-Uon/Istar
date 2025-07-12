import { Component, OnInit, inject } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SetRolePermissionService } from '../service/set.role.permission.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-set-role-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TreeModule,
        TreeTableModule,
        ButtonModule
    ],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4 ">Set Role Permission</div>
            <div class="mb-4 text-lg font-medium text-primary">{{ role.name }}</div>
            <p-treetable
                [value]="treeTableValue"
                [columns]="cols"
                selectionMode="checkbox"
                [(selectionKeys)]="selectedTreeTableValue"
                dataKey="key"
                [scrollable]="true"
                [tableStyle]="{ 'min-width': '50rem' }"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th *ngFor="let col of cols">
                            {{ col.header }}
                        </th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
                    <tr [ttRow]="rowNode" [ttSelectableRow]="rowNode">
                        <td *ngFor="let col of cols; let i = index">
                            <p-treeTableToggler [rowNode]="rowNode" *ngIf="i === 0" />
                            <p-treeTableCheckbox [value]="rowNode" *ngIf="i === 0" />
                            {{ rowData[col.field] }}
                        </td>
                    </tr>
                </ng-template>
            </p-treetable>

            <div class="flex justify-end gap-2 mt-6">
                <p-button label="Save" icon="pi pi-save" (click)="saveRolePermission()" />
                <p-button label="Cancel" icon="pi pi-times" class="p-button-secondary" (click)="goBack()" />
            </div>
        </div>
    `,
    providers: [SetRolePermissionService]
})
export class SetRolePermission implements OnInit {
    // treeTableValue: TreeNode[] = [];
    // selectedTreeTableValue: { [key: string]: any } = {};
    // cols: any[] = [];

    role: any = {};
    roleId: number = 0;
    treeTableValue: TreeNode[] = [];
    selectedTreeTableValue: { [key: string]: boolean } = {};
    cols: any[] = [];

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.roleId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadRole();
        this.loadTreeTable();
        this.cols = [
            { field: 'name', header: 'Feature' },
            { field: 'description', header: 'Description' },
        ];
    }

    loadRole() {
        this.http.get(`${environment.apiBase}/roles/${this.roleId}`).subscribe(res => {
            this.role = res;
        });
    }

    loadTreeTable() {
        forkJoin({
            features: this.http.get<TreeNode[]>(`${environment.apiBase}/features/treetable`),
            selectedPermissions: this.http.get<any[]>(`${environment.apiBase}/permissions/role/${this.roleId}`)
        }).subscribe(({ features, selectedPermissions }) => {
            this.treeTableValue = features;
            this.selectedTreeTableValue = {};
            selectedPermissions.forEach(p => {
                this.selectedTreeTableValue[p.feature.id] = true;
            });
        });
    }


saveRolePermission() {
        const selectedIds = Object.keys(this.selectedTreeTableValue)
            .filter(k => this.selectedTreeTableValue[k])
            .map(k => parseInt(k, 10));

        const payload = selectedIds.map(featureId => ({
            roleId: this.roleId,
            featureId: featureId,
            isSearch: true,
            isAdd: true,
            isViewed: true,
            isEdit: true,
            isApprove: true,
            isReject: true,
            isDeleted: true,
            isSave: true,
            isClear: true,
            isCancel: true,
            isProcess: true,
            isImport: true,
            isExport: true
        }));

        this.http.post(`${environment.apiBase}/permissions/bulk`, payload).subscribe(() => {
            alert('Permissions saved successfully!');
            this.router.navigate(['/role']);
        });
    }

    goBack() {
        this.router.navigate(['/role']);
    }

    // role: RolePermission = {
    //     id: undefined,
    //     name: '',
    //     rolesStatus: '',
    //     description: ''
    // };
    //
    // private SetRolePermissionService = inject(SetRolePermissionService);
    //
    // constructor(
    //     private router: Router,
    //     private rolePermissionService: RolePermissionService,
    //     private messageService: MessageService
    // ) {
    //     const navigation = this.router.getCurrentNavigation();
    //     if (navigation?.extras.state?.['rolePermissions']) {
    //         this.role = { ...navigation.extras.state['rolePermissions'] };
    //     }
    // }
    //
    // ngOnInit() {
    //     this.SetRolePermissionService.getTreeTableNodes().then((nodes: any) => {
    //         this.treeTableValue = nodes;
    //     });
    //
    //     this.cols = [
    //         { field: 'name', header: 'Name' },
    //         { field: 'description', header: 'Description' },
    //         { field: 'type', header: 'Type' }
    //     ];
    // }
    //
    // saveRolePermission() {
    //     const selectedKeys = Object.keys(this.selectedTreeTableValue);
    //
    //     const payload = {
    //         roleId: this.role.id,
    //         permissionKeys: selectedKeys
    //     };
    //
    //     // Replace with real API call
    //     // this.rolePermissionService.saveRolePermissions(payload).subscribe({
    //     //     next: () => {
    //     //         this.messageService.show({
    //     //             severity: 'success',
    //     //             summary: 'Success',
    //     //             detail: 'Permissions saved successfully.'
    //     //         });
    //     //         setTimeout(() => this.goBack(), 1000);
    //     //     },
    //     //     error: () => {
    //     //         this.messageService.show({
    //     //             severity: 'error',
    //     //             summary: 'Error',
    //     //             detail: 'Failed to save permissions.'
    //     //         });
    //     //     }
    //     // });
    //
    //     // No API Call
    //     this.rolePermissionService.saveRolePermissions(payload).subscribe({
    //         next: () => {
    //             this.messageService.show({
    //                 severity: 'success',
    //                 summary: 'Saved',
    //                 detail: `Permissions saved locally for role "${this.role.name}".`
    //             });
    //             setTimeout(() => this.goBack(), 1000);
    //         }
    //     });
    //
    // }
    //
    // goBack() {
    //     this.router.navigate(['/rolepermission']);
    // }
}
