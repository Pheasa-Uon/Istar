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
import { UserService, User } from '../service/user.service';
import { MessageService } from '../message/message.service';
import { Message } from '../message/message';
import { PermissionService } from '../service/permission.service';
import { HasPermissionDirective } from '../directives/has-permission.directive';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup, Message, HasPermissionDirective],
    template: `
        <div class="fixed top-3/1 right-4 z-50 w-[300px] md:w-1/3">
            <app-messages></app-messages>
        </div>

        <p-fluid>
            <form class="card flex flex-col gap-6 w-full" (ngSubmit)="saveUser()">
                <div class="font-semibold text-xl">Edit User Profile</div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="userid">User Id</label>
                        <input pInputText id="userid" type="text" [(ngModel)]="user.userCode" [readonly]="true" name="userCode" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name">Name <span class="text-red-500">*</span></label>
                        <input pInputText id="name" type="text" [(ngModel)]="user.name" name="name" required />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="username">Username <span class="text-red-500">*</span></label>
                        <input pInputText id="username" type="text" [(ngModel)]="user.username" name="username" required />
                    </div>
                    <!--                    <div class="flex flex-wrap gap-2 w-full">-->
                    <!--                        <label for="password">Password <span class="text-red-500">*</span></label>-->
                    <!--                        <div class="flex w-full items-center gap-2">-->
                    <!--                            <input-->
                    <!--                                pInputText-->
                    <!--                                id="password"-->
                    <!--                                [type]="showPassword ? 'text' : 'password'"-->
                    <!--                                [(ngModel)]="user.password"-->
                    <!--                                name="password"-->
                    <!--                                class="flex-1"-->
                    <!--                            />-->
                    <!--                            <button-->
                    <!--                                type="button"-->
                    <!--                                pButton-->
                    <!--                                icon="{{ showPassword ? 'pi pi-eye-slash' : 'pi pi-eye' }}"-->
                    <!--                                (click)="showPassword = !showPassword"-->
                    <!--                                class="p-button-sm"-->
                    <!--                            ></button>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="password">Password <span class="text-red-500">*</span></label>
                        <div class="flex w-full items-center gap-2">
                            <input pInputText id="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="user.password" name="password" class="flex-1" [readonly]="true" />
                            <button
                                type="button"
                                pButton
                                icon="{{ showPassword ? 'pi pi-eye-slash' : 'pi pi-eye' }}"
                                (click)="showPassword = !showPassword"
                                [disabled]="!user.password || user.password.trim().length === 0"
                                class="p-button-sm"
                            ></button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="email">Email <span class="text-red-500">*</span></label>
                        <input pInputText id="email" type="email" [(ngModel)]="user.email" name="email" required />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select id="status" [(ngModel)]="user.userStatus" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" name="userStatus" class="w-full"></p-select>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" rows="4" [(ngModel)]="user.description" name="description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasPermission="['USR','save']" label="Save" icon="pi pi-check" type="submit" />
                        <p-button *hasPermission="['USR','cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()" type="button" />
                    </p-buttongroup>
                </div>
            </form>
        </p-fluid>
    `
})
export class EditUser {
    user: User = {
        id: undefined,
        userCode: '',
        username: '',
        name: '',
        password: '',
        email: '',
        userStatus: '',
        description: ''
    };

    originalUser: User | null = null;

    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Block', code: 'B' },
        { name: 'Close', code: 'C' }
    ];

    showPassword = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private messageService: MessageService,
        private permissionService: PermissionService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['user']) {
            this.user = { ...navigation.extras.state['user'] };
            this.originalUser = { ...this.user };
        }
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/user']);
    }

    saveUser() {
        if (!this.originalUser || this.user.id == null) {
            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Invalid user: missing ID.'
            });
            return;
        }

        const updatedData: Partial<User> = {};
        if (this.user.name !== this.originalUser.name) updatedData.name = this.user.name;
        if (this.user.username !== this.originalUser.username) updatedData.username = this.user.username;
        if (this.user.email !== this.originalUser.email) updatedData.email = this.user.email;
        if (this.user.userStatus !== this.originalUser.userStatus) updatedData.userStatus = this.user.userStatus;
        if (this.user.description !== this.originalUser.description) updatedData.description = this.user.description;

        if (Object.keys(updatedData).length === 0) {
            this.messageService.show({
                severity: 'info',
                summary: 'No Changes',
                detail: 'No fields were changed to update.'
            });
            return;
        }

        const fullUser: Partial<User> & { id: number } = {
            ...this.originalUser,
            ...updatedData,
            id: this.user.id! // non-null assertion here
        };

        this.userService.updateUser(fullUser).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User updated successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Update failed.'
                });
            }
        });
    }
}
