import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { Fluid } from 'primeng/fluid';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { StaffModel } from '../../../model/administrator/userManagement/staff.model';
import { StaffService } from '../../../service/administrator/usersManagement/staff/staff.service';


@Component({
    selector: 'app-staff',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        Fluid,
        DividerModule,
        TreeTableModule,
        CheckboxModule,
        HasPermissionDirective,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Staff Profile</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['BRN','add']"
                              label="Add New"
                              icon="pi pi-plus"
                              (click)="addNew()">
                    </p-button>
                </div>
                <div class="md:w-1/2">
                    <div class="card flex flex-col gap-2">
                        <p-iconfield iconPosition="left">
                            <input pInputText type="text" placeholder="Search" [(ngModel)]="searchText" />
                            <p-inputicon class="pi pi-search" />
                        </p-iconfield>
                    </div>
                </div>
                <div class="card flex flex-col gap-2">
                    <div class="flex flex-wrap gap-2 md:w-1/2 justify-end items-center">
                        <p-button *hasFeaturePermission="['BRN','search']"
                                  type="button"
                                  label="Search"
                                  icon="pi pi-search"
                                  [loading]="loading[0]"
                                  (click)="search()">
                        </p-button>
                    </div>
                </div>
            </p-fluid>

            <!--
             <p-table
                [value]="roleList" [scrollable]="true" scrollHeight="475px" class="mt-4"
             >
             -->
            <p-table
                [value]="staffList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} staff"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Employee Code</th>
                        <th style="min-width:200px">Employee Name</th>
                        <th style="min-width:200px">Local Employee Name</th>
                        <th style="min-width:100px">Gender</th>
                        <th style="min-width:100px">ID Number</th>
                        <th style="min-width:150px">Position</th>
                        <th style="min-width:100px">Working Status</th>
                        <th style="min-width:150px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-staff>
                    <tr>
                        <td>{{ staff.employee_code }}</td>
                        <td>{{ staff.employee_name }}</td>
                        <td>{{ staff.local_employee_name }}</td>
                        <td>{{ staff.gender }}</td>
                        <td>{{ staff.identity_number }}</td>
                        <td>{{ staff.position?.label }}</td>
                        <td
                            [ngStyle]="{
                                'color': staff.working_status?.value === true ? 'Green' :
                                         staff.onlinworking_statuse_status?.value === false ? 'Gray' : 'black'
                        }">
                            {{ staff.working_status?.label }}
                        </td>

                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['BRN','view']"
                                          icon="pi pi-eye"
                                          text
                                          raised
                                          rounded
                                          (click)="view(staff)">
                                </p-button>

                                <p-button *hasFeaturePermission="['BRN','edit']"
                                          icon="pi pi-pencil"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="edit(staff)">
                                </p-button>

                                <p-button *hasFeaturePermission="['BRN','deleted']"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          raised
                                          rounded
                                          (click)="delete(staff)">
                                </p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="View Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1200px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Employee Code:</strong></div>
                    <div><strong>Local Employee Name:</strong></div>
                    <div><strong>ID Type:</strong></div>
                    <div><strong>Valid From:</strong></div>
                    <div><strong>Issue By:</strong></div>
                    <div><strong>Job Title:</strong></div>
                    <div><strong>Phone 1:</strong></div>
                    <div><strong>Email:</strong></div>
                    <div><strong>Position:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedStaff?.employee_code }}</div>
                    <div>{{ selectedStaff?.local_employee_name }}</div>
                    <div>{{ selectedStaff?.identity_type?.label }}</div>
                    <div>{{ selectedStaff?.valid_from }}</div>
                    <div>{{ selectedStaff?.issue_by?.label }}</div>
                    <div>{{ selectedStaff?.job_title || '-' }}</div>
                    <div>{{ selectedStaff?.phone_number1 || '-' }}</div>
                    <div>{{ selectedStaff?.email || '-' }}</div>
                    <div>{{ selectedStaff?.position?.label || '-' }}</div>
                    <div>{{ selectedStaff?.marital_status?.label || '-' }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Name:</strong></div>
                    <div><strong>Gender :</strong></div>
                    <div><strong>ID Number:</strong></div>
                    <div><strong>Valid To:</strong></div>
                    <div><strong>Date of Birth:</strong></div>
                    <div><strong>Report To:</strong></div>
                    <div><strong>Phone 2:</strong></div>
                    <div><strong>Department:</strong></div>
                    <div><strong>Employee Type:</strong></div>
                    <div><strong>Working Status:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedStaff?.employee_name }}</div>
                    <div>{{ selectedStaff?.gender }}</div>
                    <div>{{ selectedStaff?.identity_number }}</div>
                    <div>{{ selectedStaff?.valid_to }}</div>
                    <div>{{ selectedStaff?.date_of_birth }}</div>
                    <div>{{ selectedStaff?.report_to }}</div>
                    <div>{{ selectedStaff?.phone_number2 }}</div>
                    <div>{{ selectedStaff?.department?.label }}</div>
                    <div>{{ selectedStaff?.employee_type?.label }}</div>
                    <div>{{ selectedStaff?.working_status?.label }}</div>
                </div>
            </div>
            <p-divider></p-divider>
            <div class="font-semibold text-xl mb-4">Address</div>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Province:</strong></div>
                    <div><strong>Commune:</strong></div>
                    <div><strong>Address Detail:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedStaff?.province?.label || '-' }}</div>
                    <div>{{ selectedStaff?.commune?.label || '-' }}</div>
                    <div>{{ selectedStaff?.address_detail || '-' }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>District:</strong></div>
                    <div><strong>Village :</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedStaff?.district?.label || '-' }}</div>
                    <div>{{ selectedStaff?.village?.label || '-' }}</div>
                </div>

            </div>
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Start working date:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedStaff?.start_working_date || '-' }}</div>
                    <div>{{ selectedStaff?.description|| '-' }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>District:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedStaff?.current_salary || '-' }}</div>
                </div>

            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class StaffComponent {
    staffList: StaffModel[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedStaff: StaffModel | null = null;

    constructor(
        private staffService: StaffService,
        private messageService: MessageService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            staff: this.staffService.getAllStaff()
        }).subscribe({
            next: ({ staff }) => {
                this.staffList = staff;
            },
            error: (err) => {
                console.error('Initialization error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load initial data.'
                });
            }
        });
    }

    search() {
        this.loading[0] = true;
        this.staffService.searchStaff(this.searchText).subscribe({
            next: (staff) => {
                this.staffList = staff;
                this.loading[0] = false;
            },
            error: () => {
                this.loading[0] = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Search failed.'
                });
            }
        });
    }

    addNew() {
        this.router.navigate(['/add-staff']);
    }

    edit(staff: StaffModel) {
        this.router.navigate(['/edit-staff'], { state: { staff } });
        console.log(staff);
    }

    view(staff: StaffModel) {
        this.selectedStaff = staff;
        this.displayDetails = true;
    }

    delete(staff: StaffModel) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${staff.employee_name}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.staffService.deleteStaff(staff.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `Role "${staff.employee_name}" deleted successfully.`,
                            life: 3000
                        });
                        // remove from UI list
                        this.staffList = this.staffList.filter(r => r.id !== staff.id);
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete role.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
}

