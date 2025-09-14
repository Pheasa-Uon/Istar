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
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { GlobalSystemParameterService, GlobalSystemParameter } from '../../../service/administrator/system/global.system.parameter.service';
import { GSPStatusService } from '../../../service/administrator/system/gsp.status.service';

@Component({
    selector: 'app-global-system-parameter',
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
            <div class="font-semibold text-xl mb-4">Global System Parameter</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['GSP','add']" label="Add New" icon="pi pi-plus" (click)="addGlobalSystemParameter()"></p-button>
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
                        <p-button *hasFeaturePermission="['GSP','search']" type="button"
                                  label="Search"
                                  icon="pi pi-search"
                                  [loading]="loading[0]"
                                  (click)="searchGlobalSystemParameter()">
                        </p-button>
                    </div>
                </div>
            </p-fluid>

            <p-table [value]="gspList" [scrollable]="true" scrollHeight="475px" class="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Sys Par Code</th>
                        <th style="min-width:250px">Field Name</th>
                        <th style="min-width:250px">Value Name</th>
                        <th style="min-width:250px">Local Value Name</th>
                        <th style="min-width:150px">Module Name</th>
                        <th style="min-width:150px">Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-gsp>
                    <tr>
                        <td>{{ gsp.sysParCode }}</td>
                        <td>{{ gsp.fieldName }}</td>
                        <td>{{ gsp.valueName }}</td>
                        <td>{{ gsp.localValueName }}</td>
                        <td>{{ getModuleNames(gsp.moduleName || '') }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['GSP','view']" icon="pi pi-eye" text raised rounded (click)="viewGlobalSystemParameter(gsp)"></p-button>
                                <p-button *hasFeaturePermission="['GSP','edit']" icon="pi pi-pencil" text raised rounded severity="info" (click)="editGlobalSystemParameter(gsp)"></p-button>
                                <p-button *hasFeaturePermission="['GSP','deleted']" icon="pi pi-trash" text raised rounded severity="danger" (click)="deleteGlobalSystemParameter(gsp)"></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View Global System Parameter Dialog -->
        <p-dialog header="Global System Parameter Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1200px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Sys par code:</strong></div>
                    <div><strong>Field Name:</strong></div>
                    <div><strong>Local Value Name:</strong></div>
                    <div><strong>Status:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedGSP?.sysParCode }}</div>
                    <div>{{ selectedGSP?.fieldName }}</div>
                    <div>{{ selectedGSP?.localValueName }}</div>
                    <div>{{ getGSPStatus(selectedGSP?.sysParStatus || '') }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Module Name:</strong></div>
                    <div><strong>Value Name:</strong></div>
                    <div><strong>Order:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-5 py-5">
                    <div>{{ getModuleNames(selectedGSP?.moduleName || '') }}</div>
                    <div>{{ selectedGSP?.valueName }}</div>
                    <div>{{ selectedGSP?.displayOrder }}</div>
                    <div>{{ selectedGSP?.description }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class GlobalSystemParameterComponent {
    gspList: GlobalSystemParameter[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedGSP: GlobalSystemParameter | null = null;
    statusMap: Record<string, string> = {};
    moduleNameMap: Record<string, string> = {};

    constructor(
        private gspService: GlobalSystemParameterService,
        private messageService: MessageService,
        private statusService: GSPStatusService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            statusMap: this.statusService.getGSPStatus(),
            moduleNameMap: this.statusService.getModuleNames(),
            gspList: this.gspService.getAllGlobalSystemParameter()
        }).subscribe({
            next: ({ statusMap, moduleNameMap, gspList }) => {
                this.statusMap = statusMap;
                this.moduleNameMap = moduleNameMap;
                this.gspList = gspList;
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

    searchGlobalSystemParameter() {
        this.loading[0] = true;
        this.gspService.searchGlobalSystemParameter(this.searchText).subscribe({
            next: (res) => {
                this.gspList = res;
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

    addGlobalSystemParameter() {
        this.router.navigate(['/add-global-system-parameter']);
    }

    editGlobalSystemParameter(gsp: GlobalSystemParameter) {
        this.router.navigate(['/edit-global-system-parameter'], { state: { gsp } });
    }

    viewGlobalSystemParameter(gsp: GlobalSystemParameter) {
        this.selectedGSP = gsp;
        this.displayDetails = true;
    }

    deleteGlobalSystemParameter(gsp: GlobalSystemParameter) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${gsp.sysParCode}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.gspService.deleteGlobalSystemParameter(gsp.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `"${gsp.sysParCode}" deleted successfully.`,
                            life: 3000
                        });
                        this.gspList = this.gspList.filter(r => r.id !== gsp.id);
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

    getGSPStatus(code: string): string {
        return this.statusMap[code] || code;
    }

    getModuleNames(code: string): string {
        return this.moduleNameMap[code] || code;
    }
}
