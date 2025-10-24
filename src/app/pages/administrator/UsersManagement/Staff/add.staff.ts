import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ButtonGroup, ButtonGroupModule } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { StaffService } from '../../../service/administrator/usersManagement/staff/staff.service';
import {
    DropdownItemStaff,
    LongOption,
    StaffModel,
    StringOption
} from '../../../model/administrator/userManagement/staff.model';
import {
    DropdownItemIdGlobalSystemParameter,
    DropdownItemSysParCodeGlobalSystemParameter
} from '../../../model/administrator/system/global.system.parameter.model';
import { GlobalSystemParameterService } from '../../../service/administrator/system/global.system.parameter.service';
import {
    FeaturePermissionService
} from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { DatePicker } from 'primeng/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { DepartmentService } from '../../../service/administrator/systemAdmin/department.service';
import { DropdownItemDepartment } from '../../../model/administrator/systemAdmin/department.model';

@Component({
    selector: 'app-add-staff',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TextareaModule, ButtonGroup, Select, MessagesComponent, HasPermissionDirective, DatePicker, CalendarModule],
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
                            <label for="employee_name">Name <span class="text-red-500">*</span> </label>
                            <input pInputText id="employee_name" name="employee_name" type="text" placeholder="Name" [(ngModel)]="staff.employee_name" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !staff.employee_name }" />
                            <small *ngIf="submitted && !staff.employee_name" class="text-red-500">Name is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="employee_code">Local Name <span class="text-red-500">*</span></label>
                            <input
                                pInputText
                                id="local_employee_name"
                                name="local_employee_name"
                                type="text"
                                placeholder="Local Name"
                                [(ngModel)]="staff.local_employee_name"
                                required
                                class="w-full"
                                [ngClass]="{ 'p-invalid': submitted && !staff.local_employee_name }"
                            />
                            <small *ngIf="submitted && !staff.local_employee_name" class="text-red-500">Local Name is required.</small>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="gender">Gender <span class="text-red-500">*</span></label>
                            <p-select
                                id="gender"
                                name="gender"
                                class="w-full"
                                [options]="dropdownGenderItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.gender"
                                placeholder="Select Gender"
                                [ngClass]="{ 'p-invalid': submitted && !staff.gender?.value }"
                            ></p-select>
                            <small *ngIf="submitted && !staff.gender?.value" class="text-red-500">Employee name is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="identity_type">ID Type <span class="text-red-500">*</span></label>
                            <p-select
                                id="identity_type"
                                name="identity_type"
                                class="w-full"
                                [options]="dropdownIDTypeItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.identity_type"
                                placeholder="Select ID Type"
                                [ngClass]="{ 'p-invalid': submitted && !staff.identity_type?.value }"
                            ></p-select>
                            <small *ngIf="submitted && !staff.identity_type?.value" class="text-red-500">ID Type is required.</small>
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
                                [ngClass]="{ 'p-invalid': submitted && !staff.identity_number }"
                            />
                            <small *ngIf="submitted && !staff.identity_number" class="text-red-500">ID Number is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="valid_from">Valid From <span class="text-red-500">*</span></label>
                            <p-date-picker
                                id="valid_from"
                                name="valid_from"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="staff.valid_from"
                                required
                                class="w-full"
                                [style]="{ 'width': '50%' }"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.valid_from }"
                            ></p-date-picker>
                            <small *ngIf="submitted && !staff.valid_from" class="text-red-500">Valid From is required.</small>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="valid_to">Issue By <span class="text-red-500">*</span></label>
                            <p-date-picker
                                id="valid_to"
                                name="valid_to"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="staff.valid_to"
                                required
                                class="w-full"
                                [style]="{ 'width': '50%' }"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.valid_to }"
                            ></p-date-picker>
                            <small *ngIf="submitted && !staff.valid_to" class="text-red-500">Valid To is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="issue_by">Issue By </label>
                            <p-select
                                id="issue_by"
                                name="issue_by"
                                class="w-full"
                                [options]="dropdownIssueByItems"
                                optionLabel="valueName"
                                optionValue="id"
                                [(ngModel)]="staff.issue_by"
                                placeholder="Select Issue By"
                            ></p-select>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="date_of_birth">Date of Birth <span class="text-red-500">*</span></label>
                            <p-date-picker
                                id="date_of_birth"
                                name="date_of_birth"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="staff.date_of_birth"
                                required
                                class="w-full"
                                [style]="{ 'width': '50%' }"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !staff.date_of_birth }"
                            ></p-date-picker>
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
                                required
                                class="w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="report_to">Report To</label>
                            <p-select
                                id="report_to"
                                name="report_to"
                                class="w-full"
                                [options]="dropdownItemStaffs"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.report_to"
                                placeholder="Select Report To"
                            ></p-select>
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
                                required
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
                                required
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
                                type="text"
                                placeholder="Email"
                                [(ngModel)]="staff.email"
                                required
                                class="w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="department">Department</label>
                            <p-select
                                id="department"
                                name="department"
                                class="w-full"
                                [options]="dropdownItemDepartment"
                                optionLabel="department_label"
                                optionValue="id"
                                [(ngModel)]="staff.department"
                                placeholder="Select Department"
                                (onChange)="onModuleChangePosition($event)"
                            ></p-select>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email">Position</label>
                            <p-select
                                id="position"
                                name="position"
                                class="w-full"
                                [options]="dropdownPositionItems"
                                optionLabel="valueName"
                                optionValue="id"
                                [(ngModel)]="staff.position"
                                placeholder="Select Position"
                            ></p-select>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="employee_type">Employee Type</label>
                            <p-select
                                id="employee_type"
                                name="employee_type"
                                class="w-full"
                                [options]="dropdownEmployeeTypeItems"
                                optionLabel="valueName"
                                optionValue="sysParCode"
                                [(ngModel)]="staff.employee_type"
                                placeholder="Select Employee Type"
                            ></p-select>
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
                            <p-button *hasFeaturePermission="['DEP', 'save']" type="submit" label="Create New" icon="pi pi-plus-circle" [disabled]="Form.invalid"></p-button>
                            <p-button *hasFeaturePermission="['DEP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
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

    dropdownGenderItems: DropdownItemSysParCodeGlobalSystemParameter[] = [];
    dropdownIDTypeItems: DropdownItemSysParCodeGlobalSystemParameter[] = [];
    dropdownIssueByItems: DropdownItemIdGlobalSystemParameter[] = [];
    dropdownPositionItems: DropdownItemIdGlobalSystemParameter[] = [];
    dropdownEmployeeTypeItems: DropdownItemSysParCodeGlobalSystemParameter[] = [];
    dropdownProvinceItems: DropdownItemSysParCodeGlobalSystemParameter[] = [];
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
        this.staffService.getStaffDropdown().subscribe((data) => (this.dropdownItemStaffs = data));
        this.departmentService.getDepartmentDropdown().subscribe((data) => (this.dropdownItemDepartment = data));
        this.globalSystemParameterService.getGenderDropdown().subscribe((data) => (this.dropdownGenderItems = data));
        this.globalSystemParameterService.getIDTypeDropdown().subscribe((data) => (this.dropdownIDTypeItems = data));
        this.globalSystemParameterService.getIssueByDropdown().subscribe((data) => (this.dropdownIssueByItems = data));
        this.globalSystemParameterService.getEmployeeTypeDropdown().subscribe((data) => (this.dropdownEmployeeTypeItems = data));
        this.globalSystemParameterService.getProvinceDropdown().subscribe((data) => (this.dropdownProvinceItems = data));
    }

    goBack() {
        this.router.navigate(['/staff']);
    }

    save() {
        this.submitted = true;

        // Validate required field
        if (!this.staff.employee_name || !this.staff.local_employee_name || !this.staff.gender?.label || !this.staff.identity_type?.label || !this.staff.identity_number || !this.staff.valid_from || !this.staff.valid_to) {
            return;
        }

        this.staffService.addStaff(this.staff).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Department created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: (error) => {
                console.error('Error creating department:', error);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Department creation failed. Please try again.'
                });
            }
        });
    }

    onModuleChangePosition(event: any) {
        const selectedModule = event.value;
        if (selectedModule) {
            this.globalSystemParameterService.getPositionDropdown(selectedModule).subscribe({
                next: (data) => this.dropdownPositionItems = data,
                error: (err) => console.error('Error loading module fields', err)
            });
        } else {
            this.dropdownPositionItems = [];
        }
        console.log("Module changed to: " + selectedModule + "");
    }
}
