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

import { FluidModule } from 'primeng/fluid';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { GlobalPolicyService } from '../../../service/administrator/system/global.policy.service';
import { GlobalPolicyModel } from '../../../model/administrator/system/global.policy.model';
import { DateFormatPipe } from '../../../utils/date-format.pipe';
import { Time12HourPipe } from '../../../utils/time12-hour.pipe';

@Component({
    selector: 'app-global-policy',
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
        FluidModule,
        DividerModule,
        ConfirmDialogModule,
        HasPermissionDirective,
        DateFormatPipe,
        Time12HourPipe
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Global Policy</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['SYP','add']"
                              label="Add New"
                              icon="pi pi-plus"
                              (click)="addGlobalPolicy()"></p-button>
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
                        <p-button *hasFeaturePermission="['SYP','search']"
                                  type="button"
                                  label="Search"
                                  icon="pi pi-search"
                                  [loading]="loading[0]"
                                  (click)="searchGlobalPolicy()">
                        </p-button>
                    </div>
                </div>
            </p-fluid>

            <p-table
                [value]="allDataList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} system parameters"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
                class="mt-4"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Policy Code</th>
                        <th style="min-width:150px">Policy Name</th>
                        <th style="min-width:200px">Description</th>
                        <th style="min-width:150px">Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-viewDetails>
                    <tr>
                        <td>{{ viewDetails.policy_code }}</td>
                        <td>{{ viewDetails.policy_name }}</td>
                        <td>{{ viewDetails.description }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['SYP','view']"
                                          icon="pi pi-eye"
                                          text raised rounded
                                          (click)="viewGlobalPolicy(viewDetails)"></p-button>
                                <p-button *hasFeaturePermission="['SYP','edit']"
                                          icon="pi pi-pencil"
                                          text raised rounded severity="info"
                                          (click)="editGlobalPolicy(viewDetails)"></p-button>
                                <p-button *hasFeaturePermission="['SYP','deleted']"
                                          icon="pi pi-trash"
                                          text raised rounded severity="danger"
                                          (click)="deleteGlobalPolicy(viewDetails)"></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View Global Policy Dialog -->
        <p-dialog header="View Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1200px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Policy Code:</strong></div>
                    <div><strong>Valid from:</strong></div>
                    <div><strong>Number of duplicated passwords:</strong></div>
                    <div><strong>Minimum password length:</strong></div>
                    <div><strong>Included lower case letter:</strong></div>
                    <div><strong>Included symbol character:</strong></div>
                    <div><strong>Can login from:</strong></div>
                    <div><strong>Number of failed login attempts:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedRow?.policy_code }}</div>
                    <div>{{ selectedRow?.valid_from | formatDate }}</div>
                    <div>{{ selectedRow?.number_duplicated_password }}</div>
                    <div>{{ selectedRow?.minimum_password_length }}</div>
                    <div>{{ selectedRow?.included_lower_case_letter?.label }}</div>
                    <div>{{ selectedRow?.included_symbol_character?.label }}</div>
                    <div>{{ selectedRow?.can_login_from | time12Hour }}</div>
                    <div>{{ selectedRow?.number_failed_login_attempts }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Policy Name:</strong></div>
                    <div><strong>Valid to:</strong></div>
                    <div><strong>Days of password expired:</strong></div>
                    <div><strong>Complexed password?:</strong></div>
                    <div><strong>Included upper case letter:</strong></div>
                    <div><strong>Included Number:</strong></div>
                    <div><strong>Can login to:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedRow?.policy_name }}</div>
                    <div>{{ selectedRow?.valid_to | formatDate }}</div>
                    <div>{{ selectedRow?.day_password_expired }}</div>
                    <div>{{ selectedRow?.complexed_password?.label }}</div>
                    <div>{{ selectedRow?.included_upper_case_letter?.label }}</div>
                    <div>{{ selectedRow?.included_number?.label }}</div>
                    <div>{{ selectedRow?.can_login_to | time12Hour }}</div>
                    <div>{{ selectedRow?.description }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class GlobalPolicyComponent {
    allDataList: GlobalPolicyModel[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedRow: GlobalPolicyModel | null = null;
    statusMap: Record<string, string> = {};

    constructor(
        private policyService: GlobalPolicyService,
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
            policyList: this.policyService.getAllGlobalPolicy()
        }).subscribe({
            next: ({ policyList }) => {
                this.allDataList = policyList;
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

    searchGlobalPolicy() {
        this.loading[0] = true;
        this.policyService.searchGlobalPolicy(this.searchText).subscribe({
            next: (res) => {
                this.allDataList = res;
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

    addGlobalPolicy() {
        this.router.navigate(['/add-global-policy']);
    }

    editGlobalPolicy(globalPolicy: GlobalPolicyModel) {
        this.router.navigate(['/edit-global-policy'], { state: { globalPolicy } });
    }

    viewGlobalPolicy(globalPolicy: GlobalPolicyModel) {
        this.selectedRow = globalPolicy;
        this.displayDetails = true;
    }

    deleteGlobalPolicy(globalPolicy: GlobalPolicyModel) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${globalPolicy.policy_name}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.policyService.deleteGlobalPolicy(globalPolicy.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `"${globalPolicy.policy_name}" deleted successfully.`,
                            life: 3000
                        });
                        this.allDataList = this.allDataList.filter(r => r.id !== globalPolicy.id);
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
