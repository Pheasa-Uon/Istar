import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ButtonGroup, ButtonGroupModule } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { Select } from 'primeng/select';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import {
    CountryModel,
    DropdownItemCurrency
} from '../../../model/administrator/system/country.model';
import { CountryService } from '../../../service/administrator/system/country.service';
import { CurrencyService } from '../../../service/administrator/system/currency.service';
import { GlobalSystemParameterService } from '../../../service/administrator/system/global.system.parameter.service';
import { DropdownItemGlobalSystemParameter } from '../../../model/administrator/system/global.system.parameter.model';

@Component({
    selector: 'app-add-CountryModel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        TextareaModule,
        ButtonGroup,
        MessagesComponent,
        Select,
        HasPermissionDirective
    ],
    template: `

        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="save()" novalidate>

            <div class="p-fluid">
                <div class="card flex flex-col gap-6 w-full p-4">
                    <div class="font-semibold text-xl">Add New Country</div>

                    <div class="border-t border-gray-200 my-4"></div>
                    <!-- ISO Fields -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="iso2Alpha">ISO 2 Alpha <span class="text-red-500">*</span></label>
                            <input pInputText id="iso2Alpha" name="iso2Alpha" type="text"
                                   placeholder="ISO 2 Alpha" [(ngModel)]="country.iso2Alpha"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.iso2Alpha }"/>
                            <small *ngIf="submitted && !country.iso2Alpha" class="text-red-500">ISO 2 Alpha is required.</small>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="iso3Alpha">ISO 3 Alpha <span class="text-red-500">*</span></label>
                            <input pInputText id="iso3Alpha" name="iso3Alpha" type="text"
                                   placeholder="ISO 3 Alpha" [(ngModel)]="country.iso3Alpha"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.iso3Alpha }" />
                            <small *ngIf="submitted && !country.iso3Alpha" class="text-red-500">ISO 3 Alpha is required.</small>
                        </div>
                    </div>

                    <!-- Country Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="countryName">Country Name <span class="text-red-500">*</span></label>
                            <input pInputText id="countryName" name="countryName" type="text"
                                   placeholder="Country Name" [(ngModel)]="country.country_name"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.country_name }"/>
                            <small *ngIf="submitted && !country.country_name" class="text-red-500">Country name is required.</small>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="localCountryName">Local Country Name </label>
                            <input pInputText id="localCountryName" name="localCountryName" type="text"
                                   placeholder="Local Country Name" [(ngModel)]="country.local_country_name"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.local_country_name }" />
                        </div>
                    </div>

                    <!-- Selects: Currency, Language -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="currencyId">Currency </label>
                            <p-select id="currencyId" name="currencyId" class="w-full"
                                            [options]="dropdownCurrencyItems"
                                            optionLabel="label"
                                            optionValue="id"
                                            [(ngModel)]="country.currency_id"
                                            placeholder="Select Currency"></p-select>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="language">Language </label>
                            <p-select id="language" name="language" class="w-full"
                                            [options]="dropdownLanguageItems"
                                            optionLabel="valueName" optionValue="sysParCode"
                                            [(ngModel)]="country.language"
                                            placeholder="Select Language"></p-select>
                        </div>
                    </div>

                    <!-- Selects: Region, Blacklist -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="region">Region </label>
                            <p-select id="region" name="region" class="w-full"
                                            [options]="dropdownRegionItems"
                                            optionLabel="valueName" optionValue="sysParCode"
                                            [(ngModel)]="country.region"
                                            placeholder="Select Region"></p-select>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="blacklist">Blacklist </label>
                            <p-select id="blacklist" name="blacklist" class="w-full"
                                            [options]="dropdownBlacklistItems"
                                            optionLabel="valueName" optionValue="sysParCode"
                                            [(ngModel)]="country.blacklist"
                                            placeholder="Select Blacklist"></p-select>
                        </div>
                    </div>

                    <!-- Order & Status -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="displayOrder">Order <span class="text-red-500">*</span></label>
                            <input pInputText id="displayOrder" name="displayOrder" type="number"
                                   placeholder="Order" [(ngModel)]="country.display_order"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.display_order }" />
                            <small *ngIf="submitted && !country.display_order" class="text-red-500">Order is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="status">Status</label>
                            <p-select id="status" name="status" [(ngModel)]="country.country_status" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-col gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4"
                                  [(ngModel)]="country.description" class="w-full"></textarea>
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
export class AddCountry implements OnInit {
    submitted = false;
    country: CountryModel = {
        id: undefined,
        iso2Alpha: '',
        iso3Alpha: '',
        country_name: '',
        local_country_name: '',
        currency_id: undefined,
        language: undefined,
        region: undefined,
        blacklist: undefined,
        display_order: undefined,
        country_status: undefined,
        description: ''
    };

    dropdownCurrencyItems: DropdownItemCurrency[] = [];
    dropdownLanguageItems: DropdownItemGlobalSystemParameter[] = [];
    dropdownRegionItems: DropdownItemGlobalSystemParameter[] = [];
    dropdownBlacklistItems: DropdownItemGlobalSystemParameter[] = [];
    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Inactive', code: 'I' }
    ];

    constructor(
        private router: Router,
        private countryService: CountryService,
        private globalSystemParameterService: GlobalSystemParameterService,
        private currencyService: CurrencyService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.currencyService.getCurrencyDropdown().subscribe(data => this.dropdownCurrencyItems = data);
        this.globalSystemParameterService.getLanguageDropdown().subscribe(data => this.dropdownLanguageItems = data);
        this.globalSystemParameterService.getRegionDropdown().subscribe(data => this.dropdownRegionItems = data);
        this.globalSystemParameterService.getBlacklistDropdown().subscribe(data => this.dropdownBlacklistItems = data);
    }

    goBack() {
        this.router.navigate(['/country']);
    }

    save() {
        this.submitted = true;

        if (!this.country.iso2Alpha || !this.country.iso3Alpha || !this.country.country_name || this.country.display_order === undefined)
        {
            return;
        }

        this.countryService.addCountry(this.country).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'CountryModel created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: (error) => {
                console.error('Error creating CountryModel:', error);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'CountryModel creation failed. Please try again.'
                });
            }
        });

        console.log(this.country);
    }
}
