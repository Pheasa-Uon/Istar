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
import { UserService, User } from '../service/user.service';
import { RolePermissionService, RolePermission } from '../service/role.permission.service';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from '../message/message.service';
import { UsersStatusService } from '../service/user.status.service';
import { RolesStatusService } from '../service/roles.status.service';

@Component({
    selector: 'app-users',
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
        CheckboxModule
    ],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Users Profile</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button label="Add New" icon="pi pi-user-plus" (click)="addNewUser()"></p-button>
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
                        <p-button type="button" label="Search" icon="pi pi-search" [loading]="loading[0]" (click)="searchUsers()" />
                    </div>
                </div>
            </p-fluid>

            <p-table [value]="usersList" [scrollable]="true" scrollHeight="400px" class="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:200px">UserName</th>
                        <th style="min-width:200px">Name</th>
                        <th style="min-width:200px">Last Login Date</th>
                        <th style="min-width:245px">Email</th>
                        <th style="min-width:150px">Status</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-user>
                    <tr>
                        <td>{{ user.userCode }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.lastLoginAt | date:'dd-MM-yyyy HH:mm:ss' }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ getUserStatus(user.userStatus) }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button icon="pi pi-eye" text raised rounded (click)="viewUser(user)"></p-button>
                                <p-button icon="pi pi-pencil" severity="info" text raised rounded (click)="editUser(user)"></p-button>
                                <p-button icon="pi pi-trash" severity="danger" text raised rounded (click)="deleteUser(user)"></p-button>
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
                    <div><strong>Name:</strong></div>
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
            <p-table [value]="roleList" [scrollable]="true" scrollHeight="400px" class="mt-4">
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
                                <p-checkbox
                                    [binary]="true"
                                    [(ngModel)]="rolePermissions.checked"
                                    inputId="checkRolePermission{{ rolePermissions.id }}"
                                ></p-checkbox>
                            </div>
                        </td>
                        <td>{{ rolePermissions.id }}</td>
                        <td>{{ rolePermissions.name }}</td>
                        <td>{{ getRolesStatus(rolePermissions.rolesStatus || '') }}</td>
                        <td>{{ rolePermissions.description }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </p-dialog>
    `
})
export class Users {
    usersList: User[] = [];
    roleList: RolePermission[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedUser: User | null = null;
    showPassword = false;
    userStatusMap: Record<string, string> = {};
    roleStatusMap: Record<string, string> = {};
    keyword = '';
    users: User[] = [];

    constructor(
        private userService: UserService,
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService,
        private userStatusService: UsersStatusService,
        private rolesStatusService: RolesStatusService,
        private router: Router
    ) {}

    // ngOnInit() {
    //
    //     forkJoin({
    //         userStatusMap: this.userStatusService.getUserStatus(),
    //         users: this.userService.getAllUsers(),
    //         roles: this.rolePermissionService.getAllRolePermission(),
    //         statusMap: this.rolesStatusService.getRolesStatus(),
    //     }).subscribe({
    //         next: ({ statusMap, users, roles }) => {
    //             this.statusMap = statusMap;
    //             this.usersList = users;
    //             this.roleList = roles;
    //         },
    //         error: (err) => {
    //             console.error('Initialization error:', err);
    //             this.messageService.show({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: 'Failed to load initial data.'
    //             });
    //         }
    //     });
    // }

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
            error: (err) => {
                this.messageService.show({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
            }
        });

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
                // show error message if needed
            }
        });
    }


    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => (this.loading[index] = false), 1000);
    }

    addNewUser() {
        this.router.navigate(['/adduser']);
    }

    editUser(user: User) {
        this.router.navigate(['/edituser'], { state: { user } });
    }

    // viewUser(user: User) {
    //     this.selectedUser = user;
    //     this.showPassword = false;
    //     this.displayDetails = true;
    // }

    viewUser(user: User) {
        this.selectedUser = user;
        this.showPassword = false;
        this.displayDetails = true;

        // this.rolePermissionService.getAllRolePermission().then((RolePermissions) => {
        //     this.roleList = RolePermissions;
        // });
        this.rolePermissionService.getAllRolePermission().subscribe({
            next: (rolePermissions) => {
                this.roleList = rolePermissions;
            },
            error: (err) => {
                console.error('Error fetching roles:', err);
            }
        });

    }


    deleteUser(user: User) {
        if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
            this.userService.deleteUser(user.id!).subscribe({
                next: () => {
                    // Update UI immediately
                    this.usersList = this.usersList.filter((u) => u.id !== user.id);

                    this.messageService.show({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: `User "${user.name}" deleted successfully.`
                    });
                },
                error: () => {
                    this.messageService.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete user.'
                    });
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

    resetPassword(user: User) {
        if (confirm(`Reset password for "${user.name}" to default?`)) {
            this.userService.resetPassword(user.id!).subscribe({
                next: () => {
                    this.messageService.show({
                        severity: 'success',
                        summary: 'Password Reset',
                        detail: `Password for "${user.name}" reset to default.`
                    });
                },
                error: () => {
                    this.messageService.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to reset password.'
                    });
                }
            });
        }
    }

}
