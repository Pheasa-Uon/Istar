import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { RolePermissionService } from '../../../service/administrator/usersManagement/rolepermissions/role.permission.service';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { ButtonGroup } from 'primeng/buttongroup';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { RolePermissionModel, StringOption } from '../../../model/administrator/userManagement/role.permission.model';

@Component({
    selector: 'app-add-role-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        TextareaModule,
        MessagesComponent,
        ButtonGroup,
        Fluid,
        Select,
        HasPermissionDirective
    ],
    template: `

        <app-messages></app-messages>

        <form #roleForm="ngForm" (ngSubmit)="saveRolePermission()" novalidate>

            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Add New Role Permission</div>
                    <div class="border-t border-gray-200 my-4"></div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="rolesCode">Role Id</label>
                            <input
                                pInputText
                                id="rolesCode"
                                name="rolesCode"
                                type="text"
                                placeholder="Auto"
                                [readOnly]="true"
                                [(ngModel)]="rolepermission.roleCode"
                                class="w-full"
                            />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="roleName">Role Name <span class="text-red-500">*</span></label>
                            <input
                                pInputText
                                id="roleName"
                                name="roleName"
                                type="text"
                                [(ngModel)]="rolepermission.roleName"
                                required
                                class="w-full"
                                [ngClass]="{ 'p-invalid': submitted && !rolepermission.roleName }"
                            />
                            <small *ngIf="submitted && !rolepermission.roleName" class="text-red-500">
                                Role Name is required.
                            </small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="roleStatus">Status</label>
                            <p-select
                                id="roleStatus"
                                name="roleStatus"
                                [(ngModel)]="rolepermission.roleStatus"
                                [options]="dropdownItems"
                                optionLabel="name"
                                placeholder="Select One"
                                class="w-full"
                            ></p-select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full"></div>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea
                            pTextarea
                            id="description"
                            name="description"
                            rows="4"
                            [(ngModel)]="rolepermission.description"
                            class="w-full"
                        ></textarea>
                    </div>

                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button
                                *hasFeaturePermission="['RLP','save']"
                                type="submit"
                                label="Create New"
                                icon="pi pi-plus-circle"
                                [disabled]="roleForm.invalid"
                            />
                            <p-button
                                *hasFeaturePermission="['RLP','cancel']"
                                label="Cancel"
                                icon="pi pi-times"
                                (click)="goBack()"
                            ></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </p-fluid>
        </form>
    `
})
export class AddRolePermission {
    submitted = false;

    // roleStatus will hold just the string value ('A' or 'I')
    rolepermission: RolePermissionModel = {
        id: undefined,
        roleCode: '',
        roleName: '',
        roleStatus: undefined, // default Active
        description: ''
    };

    dropdownItems: StringOption[] = [
        { label: 'Active', value: 'A' },
        { label: 'Inactive', value: 'I' }
    ];

    constructor(
        private router: Router,
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/role-permission']);
    }

    saveRolePermission() {
        this.submitted = true;

        if (!this.rolepermission.roleName) {
            return;
        }

        const payload = {
            ...this.rolepermission,
            roleStatus: this.rolepermission.roleStatus?.value // already just 'A' or 'I'
        };

        this.rolePermissionService.addRolePermission(payload).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Role Permission created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Role Permission creation failed.'
                });
            }
        });
        console.log(payload);
    }
}
