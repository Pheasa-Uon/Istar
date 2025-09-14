import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
import { ConfirmationService, MessageService } from 'primeng/api';

import { UserService, User } from '../../../service/administrator/usersmanagement/users/user.service';
import { RolePermissionService, RolePermission } from '../../../service/administrator/usersmanagement/rolepermissions/role.permission.service';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
//import { MessageService } from '../../../message/message.service';
import { UsersStatusService } from '../../../service/administrator/usersmanagement/users/user.status.service';
import { RolesStatusService } from '../../../service/administrator/usersmanagement/rolepermissions/roles.status.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, DialogModule, Fluid, DividerModule, TreeTableModule, CheckboxModule, HasPermissionDirective,ConfirmDialogModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Users Profile</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['USR','add']" label="Add New" icon="pi pi-user-plus" (click)="addNewUser()"></p-button>
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
                        <p-button *hasFeaturePermission="['USR','search']" type="button" label="Search" icon="pi pi-search" [loading]="loading[0]" (click)="searchUsers()" />
                    </div>
                </div>
            </p-fluid>

            <!--
            <p-table
                [value]="usersList" *ngIf="usersList" [scrollable]="true" scrollHeight="475px" class="mt-4"
            >
            -->
            <p-table
                [value]="usersList" *ngIf="usersList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">User Id</th>
                        <th style="min-width:200px">UserName</th>
                        <th style="min-width:200px">Login Name</th>
                        <th style="min-width:200px">Last Login Date</th>
                        <th style="min-width:245px">Email</th>
                        <th style="min-width:100px">Status</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-user>
                    <tr>
                        <td>{{ user.userCode }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.lastLoginAt | date: 'dd-MM-yyyy HH:mm:ss' }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ getUserStatus(user.userStatus) }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['USR','view']" icon="pi pi-eye" text raised rounded (click)="viewUser(user)"></p-button>
                                <p-button *hasFeaturePermission="['USR','edit']" icon="pi pi-user-edit" severity="info" text raised rounded (click)="editUser(user)"></p-button>
                                <p-button *hasFeaturePermission="['USR','deleted']" icon="pi pi-user-minus" severity="danger" text raised rounded (click)="deleteUser(user)"></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="User Details" [(visible)]="displayDetails" [modal]="true" [style]="{ width: '1100px' }" [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>User Id:</strong></div>
                    <div><strong>Username:</strong></div>
                    <div><strong>Email:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedUser?.userCode }}</div>
                    <div>{{ selectedUser?.username }}</div>
                    <div>{{ selectedUser?.email }}</div>
                    <div>{{ selectedUser?.description }}</div>
                </div>

                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Login Name:</strong></div>
                    <div><strong>Password:</strong></div>
                    <div><strong>Status:</strong></div>
                </div>

                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedUser?.name }}</div>
                    <div class="flex items-center gap-1">
                        <!--                        <p-button icon="pi pi-refresh" severity="secondary" text raised rounded (click)="resetPassword(selectedUser!)"></p-button>-->
                        <span *ngIf="showPassword">{{ selectedUser?.password }}</span>
                        <span *ngIf="!showPassword">••••••••</span>
                        <!--                        <p-button-->
                        <!--                            icon="{{ showPassword ? 'pi pi-eye-slash' : 'pi pi-eye' }}"-->
                        <!--                            styleClass="p-button-text p-button-sm"-->
                        <!--                            (click)="showPassword = !showPassword"-->
                        <!--                        ></p-button>-->
                    </div>
                    <div>{{ getUserStatus(selectedUser?.userStatus || '') }}</div>
                </div>
            </div>
            <p-divider></p-divider>
            <p-table [value]="roleList" [scrollable]="true" scrollHeight="500px" class="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:50px"></th>
                        <th style="min-width:100px">Role Id</th>
                        <th style="min-width:200px">Role Permission Name</th>
                        <th style="min-width:150px">Status</th>
                        <th style="min-width:200px">Description</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rolePermissions>
                    <tr>
                        <td>
                            <div class="flex items-center">
                                <!--                                <p-checkbox-->
                                <!--                                    [binary]="true"-->
                                <!--                                    [(ngModel)]="rolePermissions.checked"-->
                                <!--                                    inputId="checkRolePermission{{ rolePermissions.id }}"-->
                                <!--                                ></p-checkbox>-->
                                <p-checkbox [binary]="true" [(ngModel)]="rolePermissions.checked" inputId="checkRolePermission{{ rolePermissions.id }}" (ngModelChange)="onRoleCheckboxChange(rolePermissions)"></p-checkbox>
                            </div>
                        </td>
                        <td>{{ rolePermissions.rolesCode }}</td>
                        <td>{{ rolePermissions.name }}</td>
                        <td>{{ getRolesStatus(rolePermissions.rolesStatus || '') }}</td>
                        <td>{{ rolePermissions.description }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})

export class UsersComponent {
    usersList: User[] = [];
    roleList: RolePermission[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedUser: User | null = null;
    showPassword = false;
    userStatusMap: Record<string, string> = {};
    roleStatusMap: Record<string, string> = {};

    constructor(
        private userService: UserService,
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService,
        private userStatusService: UsersStatusService,
        private rolesStatusService: RolesStatusService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            userStatusMap: this.userStatusService.getUserStatus(),
            roleStatusMap: this.rolesStatusService.getRolesStatus(),
            users: this.userService.getAllUsers(),
            roles: this.rolePermissionService.getAllRolePermission()
        }).subscribe({
            next: ({ userStatusMap, roleStatusMap, users, roles }) => {
                this.userStatusMap = userStatusMap;
                this.roleStatusMap = roleStatusMap;
                this.usersList = users;
                this.roleList = roles;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
            }
        });
    }

    viewUser(user: User) {
        this.selectedUser = user;
        this.showPassword = false;
        this.displayDetails = true;

        this.rolePermissionService.getAllRolePermission().subscribe({
            next: (allRoles) => {
                this.userService.getUserRoles(user.id!).subscribe({
                    next: (userRoles) => {
                        this.roleList = allRoles.map((role) => ({
                            ...role,
                            checked: userRoles.some((r) => r.id === role.id)
                        }));
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user roles' });
                    }
                });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load all roles' });
            }
        });
    }

    toggleUserRole(userId: number, role: RolePermission) {
        if (role.id == null) return;
        const payload = { userId, roleId: role.id };

        if (role.checked) {
            this.userService.assignRole(payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Assigned', detail: `Role "${role.name}" assigned.` });
                },
                error: () => {
                    role.checked = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to assign role "${role.name}".` });
                }
            });
        } else {
            this.userService.removeRole(payload).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Removed', detail: `Role "${role.name}" removed.` });
                },
                error: () => {
                    role.checked = true;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to remove role "${role.name}".` });
                }
            });
        }
    }

    getUserStatus(code: string): string {
        return this.userStatusMap[code] || code;
    }

    getRolesStatus(code: string): string {
        return this.roleStatusMap[code] || code;
    }

    addNewUser() {
        this.router.navigate(['/add-user']);
    }

    editUser(user: User) {
        this.router.navigate(['/edit-user'], { state: { user } });
    }

    // deleteUser(user: User) {
    //     if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
    //         this.userService.deleteUser(user.id!).subscribe({
    //             next: () => {
    //                 this.usersList = this.usersList.filter((u) => u.id !== user.id);
    //                 this.messageService.show({ severity: 'success', summary: 'Deleted', detail: `User "${user.name}" deleted.` });
    //             },
    //             error: () => {
    //                 this.messageService.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete user.' });
    //             }
    //         });
    //     }
    // }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete user name "${user.name}"?`,
            header: 'Confirm',
            icon: 'pi pi-fw pi-exclamation-circle',
            accept: () =>{
                this.userService.deleteUser(user.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `User "${user.name}" deleted.`,
                            life: 3000
                        });
                        this.usersList = this.usersList.filter(u => u.id !== user.id);
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete user.',
                            life: 3000
                        });
                    }
                });
            }
        })
    }

    searchUsers() {
        this.loading[0] = true;
        this.userService.searchUsers(this.searchText).subscribe({
            next: (users) => {
                this.usersList = users;
                this.loading[0] = false;
            },
            error: () => {
                this.loading[0] = false;
            }
        });
    }

    onRoleCheckboxChange(role: RolePermission) {
        if (!this.selectedUser?.id || !role.id) return;

        const request = { userId: this.selectedUser.id, roleId: role.id };

        if (role.checked) {
            this.userService.assignRole(request).subscribe({
                next: () =>
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Role Assigned',
                        detail: `${role.name} assigned to ${this.selectedUser?.name || this.selectedUser?.username || 'user'}`
                    }),
                error: () => {
                    role.checked = true;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to assign role` });
                }
            });
        } else {
            this.userService.removeRole(request).subscribe({
                next: () =>
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Role Removed',
                        detail: `${role.name} removed from ${this.selectedUser?.name || this.selectedUser?.username || 'user'}`
                    }),
                error: () => {
                    role.checked = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to remove role` });
                }
            });
        }
    }
}
