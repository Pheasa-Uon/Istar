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
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { Country } from '../../../model/administrator/system/Country';
import { CountryService } from '../../../service/administrator/system/country.service';
import { CountryDropdownItemService } from '../../../service/administrator/system/country.dropdown.item.service';

@Component({
    selector: 'app-country',
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
            <div class="font-semibold text-xl mb-4">Country</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['COU','add']"
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
                        <p-button *hasFeaturePermission="['COU','search']"
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
                [value]="countryList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} country"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:150px">ISO 2 Alpha</th>
                        <th style="min-width:150px">ISO 3 Alpha</th>
                        <th style="min-width:250px">Name</th>
                        <th style="min-width:250px">Language</th>
                        <th style="min-width:150px">Status</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-country>
                    <tr>
                        <td>{{ country.iso2Alpha }}</td>
                        <td>{{ country.iso3Alpha }}</td>
                        <td>{{ country.countryName }}</td>
                        <td>{{ getLanguages(country.language || '') }}</td>
                        <td
                            [ngStyle]="{
                                'color': country.countryStatus === 'A' ? 'Green' :
                                         country.countryStatus === 'I' ? 'Gray' : 'black'
                        }">
                            {{ getStatus(country.countryStatus || '') }}
                        </td>

                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['COU','view']"
                                          icon="pi pi-eye"
                                          text
                                          raised
                                          rounded
                                          (click)="view(country)">
                                </p-button>

                                <p-button *hasFeaturePermission="['COU','edit']"
                                          icon="pi pi-pencil"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="edit(country)">
                                </p-button>

                                <p-button *hasFeaturePermission="['COU','deleted']"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          raised
                                          rounded
                                          (click)="delete(country)">
                                </p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="Country Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1100px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>ISO 2 Alpha:</strong></div>
                    <div><strong>Country Name:</strong></div>
                    <div><strong>Currency:</strong></div>
                    <div><strong>Region:</strong></div>
                    <div><strong>Status:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedCountry?.iso2Alpha }}</div>
                    <div>{{ selectedCountry?.countryName }}</div>
                    <div>{{ getCurrency(selectedCountry?.currencyId || '')}}</div>
                    <div>{{ getRegion(selectedCountry?.region || '') }}</div>
                    <div>{{ getStatus(selectedCountry?.countryStatus || '') }}</div>
                    <div>{{ selectedCountry?.description }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>ISO 3 Alpha:</strong></div>
                    <div><strong>Local Country Name:</strong></div>
                    <div><strong>Language:</strong></div>
                    <div><strong>Blacklist:</strong></div>
                    <div><strong>Order:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedCountry?.iso3Alpha }}</div>
                    <div>{{ selectedCountry?.localCountryName }}</div>
                    <div>{{ getLanguages(selectedCountry?.language || '') }}</div>
                    <div>{{ getBlacklist(selectedCountry?.blacklist || '') }}</div>
                    <div>{{ selectedCountry?.displayOrder }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class CountryComponent {
    countryList: Country[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedCountry: Country | null = null;
    statusMap: Record<string, string> = {};
    languageMap: Record<string, string> = {};
    currencyMap: Record<string, string> = {};
    regionMap: Record<string, string> = {};
    blacklistMap: Record<string, string> = {};

    constructor(
        private countryService: CountryService,
        private messageService: MessageService,
        private statusService: CountryDropdownItemService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            statusMap: this.statusService.getCountryStatus(),
            languageMap: this.statusService.getLanguageName(),
            currencyMap: this.statusService.getCurrencyName(),
            regionMap: this.statusService.getRegionName(),
            blacklistMap: this.statusService.getBlacklistName(),
            country: this.countryService.getAllCountry()
        }).subscribe({
            next: ({ statusMap, currencyMap, languageMap, regionMap, blacklistMap, country }) => {
                this.statusMap = statusMap;
                this.languageMap = languageMap;
                this.currencyMap = currencyMap;
                this.regionMap = regionMap;
                this.blacklistMap = blacklistMap;
                this.countryList = country;
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
        this.countryService.searchCountry(this.searchText).subscribe({
            next: (Country) => {
                this.countryList = Country;
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
        this.router.navigate(['/add-country']);
    }

    edit(country: Country) {
        this.router.navigate(['/edit-country'], { state: { country } });
    }

    view(country: Country) {
        this.selectedCountry = country;
        this.displayDetails = true;
    }

    delete(country: Country) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${country.countryName}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.countryService.deleteCountry(country.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `Role "${country.countryName}" deleted successfully.`,
                            life: 3000
                        });
                        // remove from UI list
                        this.countryList = this.countryList.filter(r => r.id !== country.id);
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

    getLanguages(code: string): string {
        return this.languageMap[code] || code;
    }

    getCurrency(code: string): string {
        return this.currencyMap[code] || code;
    }

    getRegion(code: string): string {
        return this.regionMap[code] || code;
    }

    getBlacklist(code: string): string {
        return this.blacklistMap[code] || code;
    }
}

