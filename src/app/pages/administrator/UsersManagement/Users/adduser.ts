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
import { UserService } from '../../../service/administrator/usersmanagement/users/user.service';
import { User } from '../../../model/administrator/usermanagement/user.model';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { StringOption } from '../../../model/administrator/usermanagement/role.permission.model';

@Component({
    selector: 'app-add-user',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup, Message, HasPermissionDirective],
    template: `
        <form #userForm="ngForm" (ngSubmit)="saveUser()" novalidate>
            <div class="fixed top-3/1 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Add New User Profile</div>
                    <div class="border-t border-gray-200 my-4"></div>
                    <!-- First Row -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="userid">User Id</label>
                            <!--                            <input pInputText id="userid" type="text" placeholder="Auto" [readonly]="true" [(ngModel)]="user.userCode"/>-->
                            <input pInputText id="userid" name="userCode" type="text" placeholder="Auto" [readonly]="true" [(ngModel)]="user.userCode" />
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="name">Login Name <span class="text-red-500">*</span></label>
                            <input pInputText id="name" name="name" type="text" [(ngModel)]="user.name" required class="w-full" [ngClass]="{ 'p-invalid': userForm.submitted && !user.name }" />
                            <small *ngIf="userForm.submitted && !user.name" class="text-red-500">Name is required.</small>
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="username">Username <span class="text-red-500">*</span></label>
                            <input pInputText id="username" name="username" type="text" [(ngModel)]="user.username" required class="w-full" [ngClass]="{ 'p-invalid': userForm.submitted && !user.username }" />
                            <small *ngIf="userForm.submitted && !user.username" class="text-red-500">Username is required.</small>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="password">Password <span class="text-red-500">*</span></label>
                            <div class="flex w-full items-center gap-2">
                                <input pInputText id="password" name="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="user.password" required class="flex-1" [ngClass]="{ 'p-invalid': userForm.submitted && !user.password }" />
                                <button type="button" pButton icon="{{ showPassword ? 'pi pi-eye-slash' : 'pi pi-eye' }}" (click)="showPassword = !showPassword" class="p-button-sm"></button>
                            </div>
                            <small *ngIf="userForm.submitted && !user.password" class="text-red-500">Password is required.</small>
                        </div>
                    </div>

                    <!-- Third Row -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="email">Email <span class="text-red-500">*</span></label>
                            <input pInputText id="email" name="email" type="email" [(ngModel)]="user.email" required class="w-full" [ngClass]="{ 'p-invalid': userForm.submitted && !user.email }" />
                            <small *ngIf="userForm.submitted && !user.email" class="text-red-500">Email is required.</small>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="status">Status</label>
                            <p-select id="status" name="status" [(ngModel)]="user.userStatus" [options]="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></p-select>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="user.description" class="w-full"></textarea>
                    </div>

                    <!-- Save Button -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['USR','save']" type="submit" label="Create New" icon="pi pi-plus-circle" [disabled]="userForm.invalid" />
                            <p-button *hasFeaturePermission="['USR','cancel']" type="button" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </p-fluid>
        </form>
    `
})
export class AddUser {
    submitted = false;
    user: User = {
        userCode: '',
        name: '',
        username: '',
        password: '',
        email: '',
        userStatus: undefined,
        description: ''
    };

    dropdownItems: StringOption[] = [
        { name: 'Active', value: 'A' },
        { name: 'Blocked', value: 'B' },
        { name: 'Pending', value: 'P' },
        { name: 'Inactive', value: 'I' }
    ];

    showPassword = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadFromCache();
        this.permissionService.loadFromCache();

        // set default after dropdownItems is initialized
        this.user.userStatus = this.dropdownItems[0]; // default to Active
    }

    goBack() {
        this.router.navigate(['/user']);
    }

    saveUser() {
        this.submitted = true;

        if (!this.user.name || !this.user.userStatus?.value
            || !this.user.username || !this.user.password || !this.user.email
        ) {
            return; // don't proceed if required fields missing
        }

        const payload = {
            ...this.user,
            id: undefined,
            userStatus: this.user.userStatus.value // send only the value
        };

        this.userService.addUser(payload).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User saved successfully.'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save user.'
                });
            }
        });
    }
}
