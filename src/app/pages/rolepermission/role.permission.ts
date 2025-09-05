import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { Fluid } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { RolePermissionService, RolePermission} from '../service/role.permission.service';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService} from '../message/message.service';
import { forkJoin } from 'rxjs';
import { RolesStatusService } from '../service/roles.status.service';
import { FeaturePermissionService } from '../service/feature.permission.service';
import { HasPermissionDirective } from '../directives/has-permission.directive';

@Component({
    selector: 'app-role-permission',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, DialogModule, Fluid, DividerModule, TreeTableModule, CheckboxModule, HasPermissionDirective],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Role Permission</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasPermission="['RLP','add']" label="Add New" icon="pi pi-user-plus" (click)="addRolePermission()"></p-button>
                </div>
                <div class="md:w-1/2">
                    <div class="card flex flex-col gap-2">
                        <p-iconfield iconPosition="left">
                            <input pInputText type="text" placeholder="Search" [(ngModel)]="searchText" />
                            <p-inputicon class="pi pi-search" />
                        </p-iconfield>
                    </div>
                </div>
                <div class="card flex flex-col gap-2">
                    <div class="flex flex-wrap gap-2 md:w-1/2 justify-end items-center">
                        <p-button *hasPermission="['RLP','search']"  type="button" label="Search" icon="pi pi-search" [loading]="loading[0]" (click)="searchRoles()" />
                    </div>
                </div>
            </p-fluid>

            <p-table [value]="roleList" [scrollable]="true" scrollHeight="400px" class="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:250px">Name</th>
                        <th style="min-width:250px">Description</th>
                        <th style="min-width:150px">Status</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rolePermissions>
                    <tr>
                        <td>{{ rolePermissions.rolesCode }}</td>
                        <td>{{ rolePermissions.name }}</td>
                        <td>{{ rolePermissions.description }}</td>
                        <td>{{ getRolesStatus(rolePermissions.rolesStatus || '') }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasPermission="['RLP','view']"  icon="pi pi-eye" text raised rounded (click)="viewRole(rolePermissions)" />
                                <p-button *hasPermission="['RLP','add']"  icon="pi pi-share-alt" severity="info" text raised rounded (click)="setRolePermission(rolePermissions)" />
                                <p-button *hasPermission="['RLP','edit']"  icon="pi pi-pencil" severity="info" text raised rounded (click)="editRolePermission(rolePermissions)" />
                                <p-button *hasPermission="['RLP','deleted']"  icon="pi pi-trash" severity="danger" text raised rounded (click)="deleteRole(rolePermissions)" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="Role Permission Details" [(visible)]="displayDetails" [modal]="true" [style]="{ width: '1100px' }" [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Role Id:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedRole?.rolesCode }}</div>
                    <div>{{ selectedRole?.description }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Name:</strong></div>
                    <div><strong>Status:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-5 py-5">
                    <div>{{ selectedRole?.name }}</div>
                    <div>{{ getRolesStatus(selectedRole?.rolesStatus || '') }}</div>
                </div>
            </div>
        </p-dialog>
    `
})
export class RolePermissions {
    roleList: RolePermission[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedRole: RolePermission | null = null;
    statusMap: Record<string, string> = {};
    //showPassword = false;

    constructor(
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService,
        private statusService: RolesStatusService,
        private router: Router,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            statusMap: this.statusService.getRolesStatus(),
            roles: this.rolePermissionService.getAllRolePermission()
        }).subscribe({
            next: ({ statusMap, roles }) => {
                this.statusMap = statusMap;
                this.roleList = roles;
            },
            error: (err) => {
                console.error('Initialization error:', err);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load initial data.'
                });
            }
        });
    }

    searchRoles() {
        this.loading[0] = true;
        this.rolePermissionService.searchRoles(this.searchText).subscribe({
            next: (RolePermission) => {
                this.roleList = RolePermission;
                this.loading[0] = false;
            },
            error: () => {
                this.loading[0] = false;
                // show error message if needed
            }
        });
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => (this.loading[index] = false), 1000);
    }

    addRolePermission() {
        this.router.navigate(['/addrolepermission']);
    }

    editRolePermission(rolePermissions: RolePermission) {
        this.router.navigate(['/editrolepermission'], { state: { rolePermissions } });
    }

    setRolePermission(rolePermissions: RolePermission) {
        this.router.navigate(['/setrolepermission', rolePermissions.id]);
    }

    viewRole(rolePermissions: RolePermission) {
        this.selectedRole = rolePermissions;
        this.displayDetails = true;
    }

    deleteRole(rolePermissions: RolePermission) {
        if (confirm(`Are you sure you want to delete role "${rolePermissions.name}"?`)) {
            this.rolePermissionService.deleteRole(rolePermissions.id!).subscribe({
                next: () => {
                    // Removed UI update here

                    // Show success message only
                    this.messageService.show({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: `User "${rolePermissions.name}" deleted successfully.`
                    });
                },
                error: (err) => {
                    this.messageService.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete user.'
                    });
                }
            });
        }
    }

    getRolesStatus(code: string): string {
        return this.statusMap[code] || code;
    }
}
