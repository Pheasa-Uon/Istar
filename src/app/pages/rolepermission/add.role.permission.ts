// app/pages/rolepermission/add.role.permission.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { RolePermissionService, RolePermission } from '../service/role.permission.service';
import { MessageService } from '../message/message.service';
import { Message } from '../message/message';
import { ButtonGroup } from 'primeng/buttongroup';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-add-role-permission',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, DropdownModule, TextareaModule, Message, ButtonGroup, Fluid, Select],
    template: `
        <div class="fixed top-3/1 right-4 z-50 w-[500px]">
            <app-messages></app-messages>
        </div>

        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Add New Role Permission</div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="userid">User Id</label>
                        <input pInputText id="userid" type="text" placeholder="Auto" [readOnly]="true" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name">Name</label>
                        <input pInputText id="name" type="text" [(ngModel)]="rolepermission.name" />
                    </div>
                </div>


                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select id="status" [(ngModel)]="rolepermission.rolesStatus" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" rows="4" [(ngModel)]="rolepermission.description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button label="Save" icon="pi pi-check" (click)="saveRolePermission()" />
                        <p-button label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class AddRolePermission {
    rolepermission: RolePermission = {
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
        private messageService: MessageService
    ) {}

    goBack() {
        this.router.navigate(['/rolepermission']);
    }

    saveRolePermission() {
        this.rolePermissionService.addRolePermission(this.rolepermission).subscribe({
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
    }
}
