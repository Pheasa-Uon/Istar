import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { StaffService } from '../../../service/administrator/usersManagement/staff/staff.service';
import {
    DropdownItemStaff,
    StaffModel
} from '../../../model/administrator/userManagement/staff.model';
import {
    DropdownItemFieldGlobalSystemParameter
} from '../../../model/administrator/system/global.system.parameter.model';
import { GlobalSystemParameterService } from '../../../service/administrator/system/global.system.parameter.service';
import {
    FeaturePermissionService
} from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { DepartmentService } from '../../../service/administrator/systemAdmin/department.service';
import { DropdownItemDepartment } from '../../../model/administrator/systemAdmin/department.model';

@Component({
    selector: 'app-add-staff',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        TextareaModule,
        ButtonGroupModule,
        DropdownModule,
        MessagesComponent,
        HasPermissionDirective,
        CalendarModule
    ],
    template: `
        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="save()" novalidate>
            <div class="p-fluid">
                <div class="card flex flex-col gap-6 w-full p-4">
                    <div class="font-semibold text-xl">Add New Staff Profile</div>

                    <div class="border-t border-gray-200 my-4"></div>

                    <!-- Staff Code & Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="employee_code">Employee Code</label>
                            <input pInputText id="employee_code" name="employee_code" type="text" placeholder="Auto" [readonly]="true" [(ngModel)]="staff.employee_code" maxlength="4" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="employee_name">Name <span class="text-red-500">*</span></label>
                            <input pInputText id="employee_name" name="employee_name" type="text" placeholder="Name" [(ngModel)]="staff.employee_name" required class="w-full" [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.employee_name }" />
                            <small *ngIf="submitted && !staff.employee_name" class="text-red-500">Name is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="local_employee_name">Local Name <span class="text-red-500">*</span></label>
                            <input
                                pInputText
                                id="local_employee_name"
                                name="local_employee_name"
                                type="text"
                                placeholder="Local Name"
                                [(ngModel)]="staff.local_employee_name"
                                required
                                class="w-full"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.local_employee_name }"
                            />
                            <small *ngIf="submitted && !staff.local_employee_name" class="text-red-500">Local Name is required.</small>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="gender">Gender <span class="text-red-500">*</span></label>
                            <p-dropdown
                                id="gender"
                                name="gender"
                                class="w-full"
                                [options]="dropdownGenderItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.gender"
                                placeholder="Select Gender"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.gender }"
                            ></p-dropdown>
                            <small *ngIf="submitted && !staff.gender" class="text-red-500">Gender is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="identity_type">ID Type <span class="text-red-500">*</span></label>
                            <p-dropdown
                                id="identity_type"
                                name="identity_type"
                                class="w-full"
                                [options]="dropdownIDTypeItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.identity_type"
                                placeholder="Select ID Type"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.identity_type }"
                            ></p-dropdown>
                            <small *ngIf="submitted && !staff.identity_type" class="text-red-500">ID Type is required.</small>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="identity_number">ID Number <span class="text-red-500">*</span></label>
                            <input
                                pInputText
                                id="identity_number"
                                name="identity_number"
                                type="text"
                                placeholder="ID Number"
                                [(ngModel)]="staff.identity_number"
                                required
                                class="w-full"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.identity_number }"
                            />
                            <small *ngIf="submitted && !staff.identity_number" class="text-red-500">ID Number is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="valid_from">Valid From <span class="text-red-500">*</span></label>
                            <p-calendar
                                id="valid_from"
                                name="valid_from"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="staff.valid_from"
                                required
                                [style]="{ 'width': '50%' }"
                                class="w-full"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.valid_from }"
                            ></p-calendar>
                            <small *ngIf="submitted && !staff.valid_from" class="text-red-500">Valid From is required.</small>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="valid_to">Valid To <span class="text-red-500">*</span></label>
                            <p-calendar
                                id="valid_to"
                                name="valid_to"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="staff.valid_to"
                                required
                                [style]="{ 'width': '50%' }"
                                class="w-full"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.valid_to }"
                            ></p-calendar>
                            <small *ngIf="submitted && !staff.valid_to" class="text-red-500">Valid To is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="issue_by">Issue By</label>
                            <p-dropdown
                                id="issue_by"
                                name="issue_by"
                                class="w-full"
                                [options]="dropdownIssueByItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.issue_by"
                                placeholder="Select Issue By"
                            ></p-dropdown>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="date_of_birth">Date of Birth <span class="text-red-500">*</span></label>
                            <p-calendar
                                id="date_of_birth"
                                name="date_of_birth"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="staff.date_of_birth"
                                required
                                [style]="{ 'width': '50%' }"
                                class="w-full"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.date_of_birth }"
                            ></p-calendar>
                            <small *ngIf="submitted && !staff.date_of_birth" class="text-red-500">Date of Birth is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="job_title">Job Title</label>
                            <input
                                pInputText
                                id="job_title"
                                name="job_title"
                                type="text"
                                placeholder="Job Title"
                                [(ngModel)]="staff.job_title"
                                class="w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="report_to">Report To</label>
                            <p-dropdown
                                id="report_to"
                                name="report_to"
                                class="w-full"
                                [options]="dropdownItemStaffs"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.report_to"
                                placeholder="Select Report To"
                            ></p-dropdown>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="phone_number1">Phone 1</label>
                            <input
                                pInputText
                                id="phone_number1"
                                name="phone_number1"
                                type="text"
                                placeholder="Phone 1"
                                [(ngModel)]="staff.phone_number1"
                                class="w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="phone_number2">Phone 2</label>
                            <input
                                pInputText
                                id="phone_number2"
                                name="phone_number2"
                                type="text"
                                placeholder="Phone 2"
                                [(ngModel)]="staff.phone_number2"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email">Email</label>
                            <input
                                pInputText
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                [(ngModel)]="staff.email"
                                class="w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="department">Department</label>
                            <p-dropdown
                                id="department"
                                name="department"
                                class="w-full"
                                [options]="dropdownItemDepartment"
                                optionLabel="department_label"
                                optionValue="code"
                                [(ngModel)]="staff.department"
                                placeholder="Select Department"
                                (onChange)="onModuleChangePosition($event)"
                            ></p-dropdown>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="position">Position</label>
                            <p-dropdown
                                id="position"
                                name="position"
                                class="w-full"
                                [options]="dropdownPositionItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.position"
                                placeholder="Select Position"
                            ></p-dropdown>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="employee_type">Employee Type</label>
                            <p-dropdown
                                id="employee_type"
                                name="employee_type"
                                class="w-full"
                                [options]="dropdownEmployeeTypeItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.employee_type"
                                placeholder="Select Employee Type"
                            ></p-dropdown>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="marital_status">Marital Status</label>
                            <p-dropdown
                                id="marital_status"
                                name="marital_status"
                                class="w-full"
                                [options]="dropdownMaritalStatusItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.marital_status"
                                placeholder="Select Marital Status"
                            ></p-dropdown>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="working_status">Working Status</label>
                            <p-dropdown
                                id="working_status"
                                name="working_status"
                                class="w-full"
                                [options]="dropdownWorkingStatusItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.working_status"
                                placeholder="Select Working Status"
                            ></p-dropdown>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 my-2"></div>
                    <div class="font-semibold text-xm">Address ...</div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="province">Province</label>
                            <p-dropdown
                                id="province"
                                name="province"
                                class="w-full"
                                [options]="dropdownProvinceItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.province"
                                placeholder="Select Province"
                                (onChange)="onModuleChangeDistrict($event)"
                            ></p-dropdown>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="district">District</label>
                            <p-dropdown
                                id="district"
                                name="district"
                                class="w-full"
                                [options]="dropdownDistrictItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.district"
                                placeholder="Select District"
                                (onChange)="onModuleChangeCommune($event)"
                            ></p-dropdown>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="commune">Commune</label>
                            <p-dropdown
                                id="commune"
                                name="commune"
                                class="w-full"
                                [options]="dropdownCommuneItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.commune"
                                placeholder="Select Commune"
                                (onChange)="onModuleChangeVillage($event)"
                            ></p-dropdown>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="village">Village</label>
                            <p-dropdown
                                id="village"
                                name="village"
                                class="w-full"
                                [options]="dropdownVillageItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.village"
                                placeholder="Select Village"
                            ></p-dropdown>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="address_detail">Address Detail</label>
                        <textarea pTextarea id="address_detail" name="address_detail" rows="4" [(ngModel)]="staff.address_detail" class="w-full"></textarea>
                    </div>

                    <div class="border-t border-gray-200 my-2"></div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="start_working_date">Start Working Date</label>
                            <p-calendar
                                id="start_working_date"
                                name="start_working_date"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [style]="{ 'width': '50%' }"
                                [(ngModel)]="staff.start_working_date"
                                class="w-full"
                            ></p-calendar>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="current_salary">Current Salary</label>
                            <input pInputText id="current_salary" name="current_salary" type="number" placeholder="0.00" [(ngModel)]="staff.current_salary" class="w-full" />
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-col gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="staff.description" class="w-full"></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['COU','save']" type="submit" label="Create New" icon="pi pi-plus-circle" [disabled]="Form.invalid" />
                            <p-button *hasFeaturePermission="['COU','cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </div>
        </form>
    `
})
export class AddStaff implements OnInit {
    submitted = false;

    staff: StaffModel = {
        id: undefined,
        employee_code: '',
        employee_name: '',
        local_employee_name: '',
        gender: undefined,
        identity_type: undefined,
        identity_number: '',
        valid_from: undefined,
        valid_to: undefined,
        issue_by: undefined,
        date_of_birth: undefined,
        job_title: '',
        report_to: undefined,
        phone_number1: '',
        phone_number2: '',
        email: '',
        department: undefined,
        position: undefined,
        employee_type: undefined,
        marital_status: undefined,
        working_status: undefined,
        province: undefined,
        district: undefined,
        commune: undefined,
        village: undefined,
        address_detail: '',
        start_working_date: undefined,
        current_salary: undefined,
        description: ''
    };

    dropdownGenderItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownIDTypeItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownIssueByItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownPositionItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownEmployeeTypeItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownMaritalStatusItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownWorkingStatusItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownProvinceItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownDistrictItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownCommuneItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownVillageItems: DropdownItemFieldGlobalSystemParameter[] = [];
    dropdownItemStaffs: DropdownItemStaff[] = [];
    dropdownItemDepartment: DropdownItemDepartment[] = [];

    constructor(
        private router: Router,
        private staffService: StaffService,
        private globalSystemParameterService: GlobalSystemParameterService,
        private departmentService: DepartmentService,
        private permissionService: FeaturePermissionService,
        private messageService: MessageService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        this.loadDropdownData();
    }

    loadDropdownData(): void {
        this.staffService.getStaffDropdown().subscribe({
            next: (data) => this.dropdownItemStaffs = data,
            error: (err) => console.error('Error loading staff dropdown', err)
        });

        this.departmentService.getDepartmentDropdown().subscribe({
            next: (data) => this.dropdownItemDepartment = data,
            error: (err) => console.error('Error loading department dropdown', err)
        });

        this.globalSystemParameterService.getGenderDropdown().subscribe({
            next: (data) => this.dropdownGenderItems = data,
            error: (err) => console.error('Error loading gender dropdown', err)
        });

        this.globalSystemParameterService.getIDTypeDropdown().subscribe({
            next: (data) => this.dropdownIDTypeItems = data,
            error: (err) => console.error('Error loading ID type dropdown', err)
        });

        this.globalSystemParameterService.getIssueByDropdown().subscribe({
            next: (data) => this.dropdownIssueByItems = data,
            error: (err) => console.error('Error loading issue by dropdown', err)
        });

        this.globalSystemParameterService.getEmployeeTypeDropdown().subscribe({
            next: (data) => this.dropdownEmployeeTypeItems = data,
            error: (err) => console.error('Error loading employee type dropdown', err)
        });

        this.globalSystemParameterService.getMaritalStatusDropdown().subscribe({
            next: (data) => this.dropdownMaritalStatusItems = data,
            error: (err) => console.error('Error loading marital status dropdown', err)
        });

        this.globalSystemParameterService.getWorkingStatusDropdown().subscribe({
            next: (data) => this.dropdownWorkingStatusItems = data,
            error: (err) => console.error('Error loading working status dropdown', err)
        });

        this.globalSystemParameterService.getProvinceDropdown().subscribe({
            next: (data) => this.dropdownProvinceItems = data,
            error: (err) => console.error('Error loading province dropdown', err)
        });
    }

    goBack(): void {
        this.router.navigate(['/staff']);
    }

    save(): void {
        this.submitted = true;

        // Validate required fields
        if (!this.staff.employee_name || !this.staff.local_employee_name ||
            !this.staff.gender || !this.staff.identity_type ||
            !this.staff.identity_number || !this.staff.valid_from ||
            !this.staff.valid_to || !this.staff.date_of_birth) {
            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields.'
            });
            return;
        }

        const payload: StaffModel = {
            ...this.staff
        };

        this.staffService.addStaff(payload).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Staff created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: (error) => {
                console.error('Error creating staff:', error);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Staff creation failed. Please try again.'
                });
            }
        });
    }

    onModuleChangePosition(event: any): void {
        const selectedDepartment = event.value;
        if (selectedDepartment) {
            this.globalSystemParameterService.getPositionDropdown(selectedDepartment).subscribe({
                next: (data) => this.dropdownPositionItems = data,
                error: (err) => console.error('Error loading position dropdown', err)
            });
        } else {
            this.dropdownPositionItems = [];
        }
    }

    onModuleChangeDistrict(event: any): void {
        const selectedProvince = event.value;
        if (selectedProvince) {
            this.globalSystemParameterService.getDistrictDropdown(selectedProvince).subscribe({
                next: (data) => this.dropdownDistrictItems = data,
                error: (err) => console.error('Error loading district dropdown', err)
            });
        } else {
            this.dropdownDistrictItems = [];
        }
    }

    onModuleChangeCommune(event: any): void {
        const selectedDistrict = event.value;
        if (selectedDistrict) {
            this.globalSystemParameterService.getCommuneDropdown(selectedDistrict).subscribe({
                next: (data) => this.dropdownCommuneItems = data,
                error: (err) => console.error('Error loading commune dropdown', err)
            });
        } else {
            this.dropdownCommuneItems = [];
        }
    }

    onModuleChangeVillage(event: any): void {
        const selectedCommune = event.value;
        if (selectedCommune) {
            this.globalSystemParameterService.getVillageDropdown(selectedCommune).subscribe({
                next: (data) => this.dropdownVillageItems = data,
                error: (err) => console.error('Error loading village dropdown', err)
            });
        } else {
            this.dropdownVillageItems = [];
        }
    }
}
