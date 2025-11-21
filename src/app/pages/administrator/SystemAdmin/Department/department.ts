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
import { DepartmentModel } from '../../../model/administrator/systemAdmin/department.model';
import { DepartmentService } from '../../../service/administrator/systemAdmin/department.service';

@Component({
    selector: 'app-department',
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
            <div class="font-semibold text-xl mb-4">Department</div>

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
                        <p-button *hasFeaturePermission="['DEP','search']"
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
                [value]="departmentList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} department"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:200px">Department Code</th>
                        <th style="min-width:250px">Department Name</th>
                        <th style="min-width:250px">Description</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-department>
                    <tr>
                        <td>{{ department.department_code }}</td>
                        <td>{{ department.department_name }}</td>
                        <td>{{ department.description }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['DEP','view']"
                                          icon="pi pi-eye"
                                          text
                                          raised
                                          rounded
                                          (click)="view(department)">
                                </p-button>

                                <p-button *hasFeaturePermission="['DEP','edit']"
                                          icon="pi pi-pencil"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="edit(department)">
                                </p-button>

                                <p-button *hasFeaturePermission="['DEP','deleted']"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          raised
                                          rounded
                                          (click)="delete(department)">
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
                    <div><strong>Department code:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedDepartment?.department_code }}</div>
                    <div>{{ selectedDepartment?.description }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Department name:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedDepartment?.department_name }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class DepartmentComponent {
    departmentList: DepartmentModel[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedDepartment: DepartmentModel | null = null;

    constructor(
        private departmentService: DepartmentService,
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
            department: this.departmentService.getAllDepartment()
        }).subscribe({
            next: ({ department }) => {
                this.departmentList = department;
            },
            error: (err) => {
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
        this.departmentService.searchDepartment(this.searchText).subscribe({
            next: (department) => {
                this.departmentList = department;
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
        this.router.navigate(['/add-department']);
    }

    edit(department: DepartmentModel) {
        this.router.navigate(['/edit-department'], { state: { department } });
    }

    view(department: DepartmentModel) {
        this.selectedDepartment = department;
        this.displayDetails = true;
    }

    delete(department: DepartmentModel) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${department.department_name}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.departmentService.deleteDepartment(department.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `Role "${department.department_name}" deleted successfully.`,
                            life: 3000
                        });
                        // remove from UI list
                        this.departmentList = this.departmentList.filter(r => r.id !== department.id);
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

