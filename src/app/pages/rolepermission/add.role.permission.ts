// app/pages/rolepermission/add.role.permission.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
//import { DropdownModule } from 'primeng/dropdown';
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
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TextareaModule, Message, ButtonGroup, Fluid, Select],
    template: `
        <form #roleForm="ngForm" (ngSubmit)="saveRolePermission()" novalidate>
        <div class="fixed top-3/1 right-4 z-50 w-[500px]">
            <app-messages></app-messages>
        </div>

        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Add New Role Permission</div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="roleid">Role Id</label>
                        <input pInputText id="roleid" name="rolesCode" type="text" placeholder="Auto" [readOnly]="true" [(ngModel)]="rolepermission.rolesCode" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name">Name <span class="text-red-500">*</span></label>
                        <input
                            pInputText
                            id="name"
                            name="name"
                            type="text"
                            [(ngModel)]="rolepermission.name"
                            required
                            class="w-full"
                            [ngClass]="{ 'p-invalid': roleForm.submitted && !rolepermission.name }"
                        />
                        <small *ngIf="roleForm.submitted && !rolepermission.name" class="text-red-500">Name is required.</small>
                    </div>
                </div>


                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select id="status" name="status" [(ngModel)]="rolepermission.rolesStatus" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="rolepermission.description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
<!--                        <p-button label="Save" icon="pi pi-check" (click)="saveRolePermission()" />-->
                        <p-button type="submit" label="Save" icon="pi pi-check" [disabled]="roleForm.invalid"/>
                        <p-button label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
        </form>
    `
})
export class AddRolePermission {
    rolepermission: RolePermission = {
        id: undefined,
        rolesCode: '',
        name: '',
        rolesStatus: 'A',
        description: ''
    };

    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Blocked', code: 'B' },
        { name: 'Closed', code: 'C' }
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
