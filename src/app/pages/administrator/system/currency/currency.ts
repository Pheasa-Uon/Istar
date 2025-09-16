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
import { RolePermissionService, RolePermission } from '../../../service/administrator/usersmanagement/rolepermissions/role.permission.service';
import { RolesDropdownItemService } from '../../../service/administrator/usersmanagement/rolepermissions/roles.dropdown.item.service';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { Currency } from '../../../model/Currency';
import { CurrencyService } from '../../../service/administrator/system/currency.service';
import { CurrencyDropdownItemService } from '../../../service/administrator/system/currency.dropdown.item.service';

@Component({
    selector: 'app-currency',
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
            <div class="font-semibold text-xl mb-4">Currency</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['CUR','add']"
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
                        <p-button *hasFeaturePermission="['RLP','search']"
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
                [value]="currencyList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} currency"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Currency Code</th>
                        <th style="min-width:250px">Currency Char</th>
                        <th style="min-width:250px">Name</th>
                        <th style="min-width:150px">Status</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-currency>
                    <tr>
                        <td>{{ currency.currencyCode }}</td>
                        <td>{{ currency.currencyChar }} ({{ currency.currencySymbol }})</td>
                        <td>{{ currency.currencyName }}</td>
                        <td>{{ getStatus(currency.currencyStatus || '') }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['CUR','view']"
                                          icon="pi pi-eye"
                                          text
                                          raised
                                          rounded
                                          (click)="view(currency)">
                                </p-button>

                                <p-button *hasFeaturePermission="['CUR','edit']"
                                          icon="pi pi-pencil"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="edit(currency)">
                                </p-button>

                                <p-button *hasFeaturePermission="['CUR','deleted']"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          raised
                                          rounded
                                          (click)="delete(currency)">
                                </p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="Currency Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1100px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Currency code:</strong></div>
                    <div><strong>Currency Number:</strong></div>
                    <div><strong>Currency Name:</strong></div>
                    <div><strong>Decimal Digits:</strong></div>
                    <div><strong>Order:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedCurrency?.currencyCode }}</div>
                    <div>{{ selectedCurrency?.currencyNumber }}</div>
                    <div>{{ selectedCurrency?.currencyName }}</div>
                    <div>{{ selectedCurrency?.decimalDigits }}</div>
                    <div>{{ selectedCurrency?.displayOrder }}</div>
                    <div>{{ selectedCurrency?.description }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Currency Char:</strong></div>
                    <div><strong>Currency Symbol:</strong></div>
                    <div><strong>Local Currency Name:</strong></div>
                    <div><strong>Rounding Digits:</strong></div>
                    <div><strong>Status:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedCurrency?.currencyChar }}</div>
                    <div>{{ selectedCurrency?.currencySymbol }}</div>
                    <div>{{ selectedCurrency?.localCurrencyName }}</div>
                    <div>{{ selectedCurrency?.roundingDigits != null ? selectedCurrency?.roundingDigits : '-' }}</div>
                    <div>{{ getStatus(selectedCurrency?.currencyStatus || '') }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class CurrencyComponent {
    currencyList: Currency[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedCurrency: Currency | null = null;
    statusMap: Record<string, string> = {};

    constructor(
        private currencyService: CurrencyService,
        private messageService: MessageService,
        private statusService: CurrencyDropdownItemService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            statusMap: this.statusService.getCurrencyStatus(),
            roles: this.currencyService.getAllCurrency()
        }).subscribe({
            next: ({ statusMap, roles }) => {
                this.statusMap = statusMap;
                this.currencyList = roles;
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
        this.currencyService.searchCurrency(this.searchText).subscribe({
            next: (Currency) => {
                this.currencyList = Currency;
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
        this.router.navigate(['/add-currency']);
    }

    edit(currency: Currency) {
        this.router.navigate(['/edit-currency'], { state: { currency } });
    }

    view(currency: Currency) {
        this.selectedCurrency = currency;
        this.displayDetails = true;
    }

    delete(currency: Currency) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${currency.currencyName}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.currencyService.deleteCurrency(currency.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `Role "${currency.currencyName}" deleted successfully.`,
                            life: 3000
                        });
                        // remove from UI list
                        this.currencyList = this.currencyList.filter(r => r.id !== currency.id);
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

    getStatus(code: string): string {
        return this.statusMap[code] || code;
    }
}

