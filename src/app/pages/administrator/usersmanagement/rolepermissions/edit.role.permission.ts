import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fluid } from 'primeng/fluid';
import { ButtonGroup } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message'; // adjust path if needed
import { RolePermissionService, RolePermission } from '../../../service/administrator/usersmanagement/rolepermissions/role.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';

@Component({
    selector: 'app-edit-role-permission',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup, Message, HasPermissionDirective],
    template: `
        <div class="fixed top-3/1 right-4 z-50 w-[300px] md:w-1/3">
            <app-messages></app-messages>
        </div>

        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Edit Role Permission</div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="roleid">Role Id</label>
                        <input pInputText id="roleid" type="text" [(ngModel)]="role.rolesCode" [readOnly]="true" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name">Role Name <span class="text-red-500">*</span></label>
                        <input pInputText id="name" type="text" [(ngModel)]="role.name" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select id="status" [(ngModel)]="role.rolesStatus" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full"></div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" rows="4" [(ngModel)]="role.description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['RLP', 'save']" label="Save" icon="pi pi-check" (click)="saveRolePermission()" />
                        <p-button *hasFeaturePermission="['RLP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class EditRolePermission {
    role: RolePermission = {
        id: undefined,
        rolesCode: '',
        name: '',
        rolesStatus: '',
        description: ''
    };

    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Block', code: 'B' },
        { name: 'Close', code: 'C' }
    ];

    constructor(
        private router: Router,
        private rolePermissionService: RolePermissionService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['rolePermissions']) {
            this.role = { ...navigation.extras.state['rolePermissions'] };
        };
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/rolepermission']);
    }

    saveRolePermission() {
        this.rolePermissionService.updateRolePermission(this.role).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Role Permission updated successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Role Permission update failed.'
                });
            }
        });
    }
}
