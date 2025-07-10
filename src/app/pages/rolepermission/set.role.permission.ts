import { Component, OnInit, inject } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NodeService } from '../service/node.service';
import { RolePermission, RolePermissionService } from '../service/role.permission.service';
import { MessageService } from '../message/message.service';
import { ButtonModule } from 'primeng/button';
import { SetRolePermissionService } from '../service/set.role.permission.service';

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
    treeTableValue: TreeNode[] = [];
    selectedTreeTableValue: { [key: string]: any } = {};
    cols: any[] = [];

    role: RolePermission = {
        id: undefined,
        name: '',
        rolesStatus: '',
        description: ''
    };

    private SetRolePermissionService = inject(SetRolePermissionService);

    constructor(
        private router: Router,
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['rolePermissions']) {
            this.role = { ...navigation.extras.state['rolePermissions'] };
        }
    }

    ngOnInit() {
        this.SetRolePermissionService.getTreeTableNodes().then((nodes: any) => {
            this.treeTableValue = nodes;
        });

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'type', header: 'Type' }
        ];
    }

    saveRolePermission() {
        const selectedKeys = Object.keys(this.selectedTreeTableValue);

        const payload = {
            roleId: this.role.id,
            permissionKeys: selectedKeys
        };

        // Replace with real API call
        // this.rolePermissionService.saveRolePermissions(payload).subscribe({
        //     next: () => {
        //         this.messageService.show({
        //             severity: 'success',
        //             summary: 'Success',
        //             detail: 'Permissions saved successfully.'
        //         });
        //         setTimeout(() => this.goBack(), 1000);
        //     },
        //     error: () => {
        //         this.messageService.show({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: 'Failed to save permissions.'
        //         });
        //     }
        // });

        // No API Call
        this.rolePermissionService.saveRolePermissions(payload).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Saved',
                    detail: `Permissions saved locally for role "${this.role.name}".`
                });
                setTimeout(() => this.goBack(), 1000);
            }
        });

    }

    goBack() {
        this.router.navigate(['/rolepermission']);
    }
}
