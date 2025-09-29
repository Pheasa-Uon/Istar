import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ButtonGroup } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message'; // adjust path if needed
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import {
    BranchModel,
    DropdownItemBranch,
    DropdownItemProvince
} from '../../../model/administrator/systemAdmin/branch.model';
import { BranchService } from '../../../service/administrator/systemAdmin/branch.service';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
    selector: 'app-edit-branch',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, ButtonGroup, Message, HasPermissionDirective, ToggleSwitch],
    template: `
        <form #Form="ngForm" (ngSubmit)="save()" novalidate>
            <div class="fixed top-0 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <div class="p-fluid">
                <div class="card flex flex-col gap-6 w-full p-4">
                    <div class="font-semibold text-xl">Edit Branch</div>
                    <div class="border-t border-gray-200 my-4"></div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="branchCode">Branch code <span class="text-red-500">*</span></label>
                            <input pInputText id="branchCode" name="branchCode" type="text" placeholder="Branch code" [readonly]="true" [(ngModel)]="branch.branchCode" maxlength="4" class="w-full" [ngClass]="{ 'p-invalid': submitted && !branch.branchCode }" />
                            <small *ngIf="submitted && !branch.branchCode" class="text-red-500">Branch code is required.</small>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="branchName">Branch Name <span class="text-red-500">*</span></label>
                            <input pInputText id="branchName" name="branchName" type="text" placeholder="Branch name" [(ngModel)]="branch.branchName" class="w-full" [ngClass]="{ 'p-invalid': submitted && !branch.branchCode }" />
                        </div>
                        <small *ngIf="submitted && !branch.branchName" class="text-red-500">Branch name is required.</small>
                    </div>

                    <!-- Country Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="branchPrefix">Branch Prefix </label>
                            <input pInputText id="branchPrefix" name="branchPrefix" type="text" placeholder="Branch prefix" [(ngModel)]="branch.branchPrefix" class="w-full" [ngClass]="{ 'p-invalid': submitted && !branch.branchPrefix }" />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="localBranchName">Local Branch Name <span class="text-red-500">*</span></label>
                            <input
                                pInputText
                                id="localBranchName"
                                name="localBranchName"
                                type="text"
                                placeholder="Local Branch Name"
                                [(ngModel)]="branch.localBranchName"
                                class="w-full"
                                [ngClass]="{ 'p-invalid': submitted && !branch.localBranchName }"
                            />
                            <small *ngIf="submitted && !branch.localBranchName" class="text-red-500">Local branch name is required.</small>
                        </div>
                    </div>

                    <!-- Selects: City/Province, Phone -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="province">City/Province <span class="text-red-500">*</span></label>
                            <p-select
                                id="province"
                                name="province"
                                class="w-full"
                                [options]="dropdownProvinceItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="branch.province"
                                placeholder="Select City/Province"
                                [ngClass]="{ 'p-invalid': submitted && !branch.province }"
                            ></p-select>
                            <small *ngIf="submitted && !branch.province" class="text-red-500">City/Province is required.</small>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="phone">Phone </label>
                            <input pInputText id="phone" name="phone" type="text" placeholder="Phone" [(ngModel)]="branch.phone" class="w-full" />
                        </div>
                    </div>

                    <!-- Selects: Email, Address -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email">Email </label>
                            <input pInputText id="email" name="email" type="text" placeholder="Email" [(ngModel)]="branch.email" class="w-full" />
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="address">Address </label>
                            <input pInputText id="address" name="address" type="text" placeholder="Address" [(ngModel)]="branch.address" class="w-full" />
                        </div>
                    </div>

                    <!-- Selects: Clone GL from Branch, Online -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="cloneGlFromBranch">Clone GL from </label>
                            <p-select id="cloneGlFromBranch" name="cloneGlFromBranch" class="w-full" [options]="dropdownBranchItems" optionLabel="label" optionValue="id" [(ngModel)]="branch.cloneGlFromBranch" placeholder="Select Branch" [readonly]="true"></p-select>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="phone">Online </label>
                            <p-select id="onlineStatus" name="onlineStatus" class="w-full" [options]="dropdownItems" optionLabel="name" optionValue="value" [(ngModel)]="branch.onlineStatus" placeholder="Select online status"></p-select>
                        </div>
                    </div>
                    <!-- Description -->
                    <div class="flex flex-col gap-2 w-full">
                        <label for="isHq">Online</label>
                        <p-toggleswitch name="isHq" [(ngModel)]="branch.isHq"></p-toggleswitch>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-col gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="branch.description" class="w-full"></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['COU', 'save']" type="submit" label="Save" icon="pi pi-check" [disabled]="Form.invalid" />
                            <p-button *hasFeaturePermission="['COU', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </div>
        </form>
    `
})
export class EditBranch {
    submitted = false;
    branch: BranchModel = {
        id: undefined,
        branchCode: '',
        branchName: '',
        localBranchName: '',
        branchPrefix: '',
        province: undefined,
        phone: '',
        email: '',
        address: '',
        isHq: undefined,
        cloneGlFromBranch: undefined,
        onlineStatus: undefined,
        description: ''
    };

    dropdownBranchItems: DropdownItemBranch[] = [];
    dropdownProvinceItems: DropdownItemProvince[] = [];
    dropdownItems = [
        { name: 'Yes', value: true },
        { name: 'No', value: false }
    ];

    constructor(
        private router: Router,
        private branchService: BranchService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['branch']) {
            const branch = { ...navigation.extras.state['branch'] };

            this.branch = {
                ...branch,
                province: branch.province?.value, // primitive id
                isHq: branch.isHq?.value, // primitive code
                cloneGlFromBranch: branch.cloneGlFromBranch?.value,
                onlineStatus: branch.onlineStatus?.value
            };
        }

        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        this.branchService.getBranchDropdown().subscribe((data) => (this.dropdownBranchItems = data));
        this.branchService.getProvinceDropdown().subscribe((data) => (this.dropdownProvinceItems = data));
    }

    goBack() {
        this.router.navigate(['/branch']);
    }

    save() {
        this.submitted = true;

        if (!this.branch.branchCode || !this.branch.branchName || !this.branch.localBranchName || this.branch.province === undefined) {
            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields.'
            });
            return;
        }

        this.branchService.updateBranch(this.branch).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Country updated successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Country update failed.'
                });
            }
        });
    }
}
