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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { Fluid } from 'primeng/fluid';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { SystemParameterService } from '../../../service/administrator/system/system.parameter.service';
import { SystemParameterModel } from '../../../model/administrator/system/system.parameter.model';
import { SPDropdownItemService } from '../../../service/administrator/system/system.parameter.dropdown.item.service';

@Component({
    selector: 'app-System-parameter',
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
        ConfirmDialogModule,
        HasPermissionDirective
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">System Parameter</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['SYP','add']" label="Add New" icon="pi pi-plus" (click)="addSystemParameter()"></p-button>
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
                        <p-button *hasFeaturePermission="['SYP','search']" type="button"
                                  label="Search"
                                  icon="pi pi-search"
                                  [loading]="loading[0]"
                                  (click)="searchSystemParameter()">
                        </p-button>
                    </div>
                </div>
            </p-fluid>
            <!--
            <p-table [value]="gspList" [scrollable]="true" scrollHeight="475px" class="mt-4">
            -->
            <p-table
                [value]="SPList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} system parameters"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Parameter Module</th>
                        <th style="min-width:150px">Parameter Name</th>
                        <th style="min-width:200px">Parameter Value</th>
                        <th style="min-width:200px">Description</th>
                        <th style="min-width:150px">Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-sp>
                    <tr>
                        <td>{{ sp.parameter_module?.label }}</td>
                        <td>{{ sp.parameter_name }}</td>
                        <td>{{ sp.parameter_value }}</td>
                        <td>{{ sp.description }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['SYP','view']" icon="pi pi-eye" text raised rounded (click)="viewSystemParameter(sp)"></p-button>
                                <p-button *hasFeaturePermission="['SYP','edit']" icon="pi pi-pencil" text raised rounded severity="info" (click)="editSystemParameter(sp)"></p-button>
                                <p-button *hasFeaturePermission="['SYP','deleted']" icon="pi pi-trash" text raised rounded severity="danger" (click)="deleteSystemParameter(sp)"></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View Global System Parameter Dialog -->
        <p-dialog header="System Parameter Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1200px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Parameter Module:</strong></div>
                    <div><strong>Parameter Value:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedSP?.parameter_module?.label }}</div>
                    <div>{{ selectedSP?.parameter_value }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Parameter Name:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-5 py-5">
                    <div>{{ selectedSP?.parameter_name }}</div>
                    <div>{{ selectedSP?.description }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class SystemParameterComponent {
    SPList: SystemParameterModel[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedSP: SystemParameterModel | null = null;
    moduleNameMap: Record<string, string> = {};

    constructor(
        private spService: SystemParameterService,
        private messageService: MessageService,
        private statusService: SPDropdownItemService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            moduleNameMap: this.statusService.getModuleNames(),
            spList: this.spService.getAllSystemParameter()
        }).subscribe({
            next: ({ moduleNameMap, spList }) => {
                this.moduleNameMap = moduleNameMap;
                this.SPList = spList;
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

    searchSystemParameter() {
        this.loading[0] = true;
        this.spService.searchSystemParameter(this.searchText).subscribe({
            next: (res) => {
                this.SPList = res;
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

    addSystemParameter() {
        this.router.navigate(['/add-system-parameter']);
    }

    editSystemParameter(sp: SystemParameterModel) {
        this.router.navigate(['/edit-system-parameter'], { state: { sp } });
    }

    viewSystemParameter(sp: SystemParameterModel) {
        this.selectedSP = sp;
        this.displayDetails = true;
    }

    deleteSystemParameter(sp: SystemParameterModel) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${sp.parameter_name}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.spService.deleteSystemParameter(sp.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `"${sp.parameter_name}" deleted successfully.`,
                            life: 3000
                        });
                        this.SPList = this.SPList.filter(r => r.id !== sp.id);
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
}
