import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ButtonGroup, ButtonGroupModule } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message';
import { Select } from 'primeng/select';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { CountryModel } from '../../../model/administrator/system/country.model';
import { CountryService } from '../../../service/administrator/system/country.service';
import {
    CountryDropdownItemService,
    DropdownItemCurrency,
    DropdownItemLanguage,
    DropdownItemRegion,
    DropdownItemBlacklist
} from '../../../service/administrator/system/country.dropdown.item.service';

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
        Message,
        Select,
        HasPermissionDirective
    ],
    template: `
        <form #Form="ngForm" (ngSubmit)="save()" novalidate>
            <div class="fixed top-0 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

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
                                   placeholder="Country Name" [(ngModel)]="country.countryName"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.countryName }"/>
                            <small *ngIf="submitted && !country.countryName" class="text-red-500">Country name is required.</small>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="localCountryName">Local Country Name </label>
                            <input pInputText id="localCountryName" name="localCountryName" type="text"
                                   placeholder="Local Country Name" [(ngModel)]="country.localCountryName"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.localCountryName }" />
                        </div>
                    </div>

                    <!-- Selects: Currency, Language -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="currencyId">Currency </label>
                            <p-select id="currencyId" name="currencyId" class="w-full"
                                            [options]="dropdownCurrencyItems"
                                            optionLabel="name"
                                            optionValue="id"
                                            [(ngModel)]="country.currencyId"
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
                                   placeholder="Order" [(ngModel)]="country.displayOrder"
                                   class="w-full" [ngClass]="{ 'p-invalid': submitted && !country.displayOrder }" />
                            <small *ngIf="submitted && !country.displayOrder" class="text-red-500">Order is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="status">Status</label>
                            <p-select id="status" name="status" [(ngModel)]="country.countryStatus" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
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
        countryName: '',
        localCountryName: '',
        currencyId: undefined,
        language: '',
        region: '',
        blacklist: '',
        displayOrder: undefined,
        countryStatus: 'A',
        description: ''
    };

    dropdownCurrencyItems: DropdownItemCurrency[] = [];
    dropdownLanguageItems: DropdownItemLanguage[] = [];
    dropdownRegionItems: DropdownItemRegion[] = [];
    dropdownBlacklistItems: DropdownItemBlacklist[] = [];
    dropdownItems = [
        { name: 'Active', code: 'A' },
        //{ name: 'Blocked', code: 'B' },
        { name: 'Inactive', code: 'I' }
    ];

    constructor(
        private router: Router,
        private countryService: CountryService,
        private messageService: MessageService,
        private dropdownService: CountryDropdownItemService
    ) {}

    ngOnInit(): void {
        this.dropdownService.getCurrencyDropdown().subscribe(data => this.dropdownCurrencyItems = data);
        this.dropdownService.getLanguageDropdown().subscribe(data => this.dropdownLanguageItems = data);
        this.dropdownService.getRegionDropdown().subscribe(data => this.dropdownRegionItems = data);
        this.dropdownService.getBlacklistDropdown().subscribe(data => this.dropdownBlacklistItems = data);
    }

    goBack() {
        this.router.navigate(['/country']);
    }

    save() {
        this.submitted = true;

        if (!this.country.iso2Alpha || !this.country.iso3Alpha || !this.country.countryName || this.country.displayOrder === undefined) {
            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields.'
            });
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
    }
}
