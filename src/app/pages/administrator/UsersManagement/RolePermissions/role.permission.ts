import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { Fluid } from 'primeng/fluid';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { RolePermissionService } from '../../../service/administrator/usersmanagement/rolepermissions/role.permission.service';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { RolePermission } from '../../../model/administrator/usermanagement/RolePermission';

@Component({
    selector: 'app-role-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        Fluid,
        DividerModule,
        TreeTableModule,
        CheckboxModule,
        HasPermissionDirective,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Role Permission</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['RLP','add']"
                              label="Add New"
                              icon="pi pi-plus"
                              (click)="addRolePermission()">
                    </p-button>
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
                        <p-button *hasFeaturePermission="['RLP','search']"
                                  type="button"
                                  label="Search"
                                  icon="pi pi-search"
                                  [loading]="loading[0]"
                                  (click)="searchRoles()">
                        </p-button>
                    </div>
                </div>
            </p-fluid>

            <!--
             <p-table
                [value]="roleList" [scrollable]="true" scrollHeight="475px" class="mt-4"
             >
             -->
            <p-table
                [value]="roleList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} role permissions"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:250px">Role Name</th>
                        <th style="min-width:250px">Description</th>
                        <th style="min-width:150px">Status</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rolePermissions>
                    <tr>
                        <td>{{ rolePermissions.roleCode }}</td>
                        <td>{{ rolePermissions.roleName }}</td>
                        <td>{{ rolePermissions.description }}</td>
                        <td
                            [ngStyle]="{
                                'color': rolePermissions.roleStatus?.value === 'A' ? 'Green' :
                                         rolePermissions.roleStatus?.value === 'I' ? 'Gray' : 'black'
                        }">{{ rolePermissions.roleStatus?.name }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['RLP','view']"
                                          icon="pi pi-eye"
                                          text
                                          raised
                                          rounded
                                          (click)="viewRole(rolePermissions)">
                                </p-button>

                                <p-button *hasFeaturePermission="['RLP','add']"
                                          icon="pi pi-share-alt"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="setRolePermission(rolePermissions)">
                                </p-button>

                                <p-button *hasFeaturePermission="['RLP','edit']"
                                          icon="pi pi-pencil"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="editRolePermission(rolePermissions)">
                                </p-button>

                                <p-button *hasFeaturePermission="['RLP','deleted']"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          raised
                                          rounded
                                          (click)="deleteRole(rolePermissions)">
                                </p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="Role Permission Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1100px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Role Id:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedRole?.roleCode }}</div>
                    <div>{{ selectedRole?.description }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Role Name:</strong></div>
                    <div><strong>Status:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-5 py-5">
                    <div>{{ selectedRole?.roleName }}</div>
                    <div>{{ selectedRole?.roleStatus?.name }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class RolePermissionsComponent {
    roleList: RolePermission[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedRole: RolePermission | null = null;

    constructor(
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            roles: this.rolePermissionService.getAllRolePermission()
        }).subscribe({
            next: ({ roles }) => {
                this.roleList = roles;
            },
            error: (err) => {
                console.error('Initialization error:', err);
                this.messageService.add({
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
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Search failed.'
                });
            }
        });
    }

    addRolePermission() {
        this.router.navigate(['/add-role-permission']);
    }

    editRolePermission(rolePermissions: RolePermission) {
        this.router.navigate(['/edit-role-permission'], { state: { rolePermissions } });
    }

    setRolePermission(rolePermissions: RolePermission) {
        this.router.navigate(['/set-role-permission', rolePermissions.id]);
    }

    viewRole(rolePermissions: RolePermission) {
        this.selectedRole = rolePermissions;
        this.displayDetails = true;
    }

    deleteRole(rolePermissions: RolePermission) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${rolePermissions.roleName}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.rolePermissionService.deleteRole(rolePermissions.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `Role "${rolePermissions.roleName}" deleted successfully.`,
                            life: 3000
                        });
                        // remove from UI list
                        this.roleList = this.roleList.filter(r => r.id !== rolePermissions.id);
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete role.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
}

