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
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '../../../service/administrator/usersManagement/users/user.service';
import { BranchService } from '../../../service/administrator/systemAdmin/branch.service';
import { UserResponse } from '../../../model/administrator/userManagement/user.model';
import { UserBranchModel } from '../../../model/administrator/userManagement/user.branch';
import { StringOption } from '../../../model/administrator/userManagement/role.permission.model';
import { MessageService } from '../../../message/message.service';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { MessagesComponent } from '../../../message/message';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        Select,
        Textarea,
        Fluid,
        ButtonGroup,
        MessagesComponent,
        HasPermissionDirective,
        MultiSelectModule
    ],
    template: `
        <app-messages></app-messages>
        <form #userForm="ngForm" (ngSubmit)="saveUser()" novalidate>
            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Edit User Profile</div>
                    <div class="border-t border-gray-200 my-4"></div>

                    <!-- User Info -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label>User Id</label>
                            <input pInputText [(ngModel)]="user.user_code" name="userCode" readonly class="w-full" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label>Login Name <span class="text-red-500">*</span></label>
                            <input pInputText [(ngModel)]="user.name" name="name" required class="w-full" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label>Username <span class="text-red-500">*</span></label>
                            <input pInputText [(ngModel)]="user.username" name="username" required class="w-full" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label>Password</label>
                            <input pInputText [(ngModel)]="user.password" name="password" type="password" readonly class="w-full" />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label>Email <span class="text-red-500">*</span></label>
                            <input pInputText [(ngModel)]="user.email" name="email" required class="w-full" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label>Status</label>
                            <p-select [(ngModel)]="user.user_status" name="status" [options]="dropdownItems" optionLabel="label" optionValue="value" placeholder="Select One" class="w-full"></p-select>
                        </div>
                    </div>

                    <!-- Branch MultiSelect -->
                    <div class="flex flex-col w-full">
                        <label>Branch</label>
                        <p-multiselect
                            [options]="dropdownBranchItems"
                            [(ngModel)]="selectedBranches"
                            [ngModelOptions]="{standalone: true}"
                            optionLabel="label"
                            optionValue="id"
                            placeholder="Select Branch"
                            display="chip"
                            [filter]="true">
                        </p-multiselect>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-wrap gap-2 w-full">
                        <label>Description</label>
                        <textarea pTextarea [(ngModel)]="user.description" name="description" rows="4" class="w-full"></textarea>
                    </div>

                    <!-- Save/Cancel Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['USR','save']" type="submit" label="Save" icon="pi pi-check" [disabled]="userForm.invalid"></p-button>
                            <p-button *hasFeaturePermission="['USR','cancel']" type="button" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </p-fluid>
        </form>
    `
})
export class EditUser {
    user: UserResponse = {
        id: undefined,
        user_code: '',
        username: '',
        name: '',
        password: '',
        email: '',
        user_status: undefined,
        description: ''
    };

    dropdownItems: StringOption[] = [
        { label: 'Active', value: 'A' },
        { label: 'Blocked', value: 'B' },
        { label: 'Pending', value: 'P' },
        { label: 'Inactive', value: 'I' }
    ];

    dropdownBranchItems: UserBranchModel[] = [];
    selectedBranches: number[] = []; // IDs of selected branches
    originalBranches: number[] = []; // IDs for comparison

    constructor(
        private router: Router,
        private userService: UserService,
        private branchService: BranchService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadFromCache();
        const navUser = this.router.getCurrentNavigation()?.extras.state?.['user'];
        if (navUser) {
            this.user = {
                ...navUser,
                user_status: navUser.user_status?.value
            };
        }
    }

    ngOnInit() {
        // Load all branches
        this.branchService.getBranchDropdown().subscribe(data => {
            this.dropdownBranchItems = data;
        });

        // Load user's existing branches and pre-select
        if (this.user.id) {
            this.userService.getUserBranches(this.user.id).subscribe(branches => {
                this.selectedBranches = branches.map(b => b.id!);
                this.originalBranches = [...this.selectedBranches]; // copy for comparison
            });
        }
    }

    goBack() {
        this.router.navigate(['/user']);
    }

    saveUser() {
        if (!this.user.name || !this.user.username || !this.user.email || !this.user.user_status) {
            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields.'
            });
            return;
        }

        const payload = { ...this.user, user_status: this.user.user_status };

        // Update user
        this.userService.updateUser(payload as any).subscribe({
            next: savedUser => {
                // Assign new branches
                this.selectedBranches.forEach(branchId => {
                    if (!this.originalBranches.includes(branchId)) {
                        this.userService.assignBranch({ userId: savedUser.id!, branchId }).subscribe();
                    }
                });

                // Remove unselected branches
                this.originalBranches.forEach(branchId => {
                    if (!this.selectedBranches.includes(branchId)) {
                        this.userService.removeBranch({ userId: savedUser.id!, branchId }).subscribe();
                    }
                });

                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User updated successfully.'
                });

                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update user.'
                });
            }
        });
    }
}
