import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { ButtonGroup } from 'primeng/buttongroup';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { CurrencyService } from '../../../service/administrator/system/currency.service';
import { CurrencyModel } from '../../../model/administrator/system/currency.model';

@Component({
    selector: 'app-add-CurrencyModel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        TextareaModule,
        MessagesComponent,
        ButtonGroup,
        Fluid,
        Select,
        HasPermissionDirective
    ],
    template: `

        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="save()" novalidate>

            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Add New Currency</div>
                    <div class="border-t border-gray-200 my-4"></div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyId">Currency Code <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyId" name="currencyCode" type="text" placeholder="Currency Code" [(ngModel)]="currency.currency_code" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currency_code }"/>
                            <small *ngIf="submitted && !currency.currency_code" class="text-red-500">Currency code is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyChar">Currency Char <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyChar" name="currencyChar" type="text" placeholder="Currency Char"  [(ngModel)]="currency.currency_char" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currency_char }" />
                            <small *ngIf="submitted && !currency.currency_char" class="text-red-500">Currency char is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyNumber">Currency Number <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyNumber" name="currencyNumber" type="text" placeholder="Currency Number" [(ngModel)]="currency.currency_number" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currency_number }"/>
                            <small *ngIf="submitted && !currency.currency_number" class="text-red-500">Currency number is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencySymbol">Currency Symbol <span class="text-red-500">*</span></label>
                            <input pInputText id="currencySymbol" name="currencySymbol" type="text" placeholder="Currency Symbol" [(ngModel)]="currency.currency_symbol" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currency_symbol }" />
                            <small *ngIf="submitted && !currency.currency_symbol" class="text-red-500">Currency char is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyName">Currency Name <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyName" name="currencyName" type="text" placeholder="Currency Name" [(ngModel)]="currency.currency_name" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currency_name }"/>
                            <small *ngIf="submitted && !currency.currency_name" class="text-red-500">Currency name is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="localCurrencyName">Local Currency Name <span class="text-red-500">*</span></label>
                            <input pInputText id="localCurrencyName" name="localCurrencyName" type="text" placeholder="Local Currency Name" [(ngModel)]="currency.local_currency_name" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.local_currency_name }" />
                            <small *ngIf="submitted && !currency.local_currency_name" class="text-red-500">Local currency name is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="decimalDigits">Decimal Digits <span class="text-red-500">*</span></label>
                            <input pInputText id="decimalDigits" name="decimalDigits" type="text" placeholder="Decimal Digits" [(ngModel)]="currency.decimal_digits" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.decimal_digits }"/>
                            <small *ngIf="submitted && !currency.decimal_digits" class="text-red-500">Decimal Digits is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="roundDigits">Rounding Digits <span class="text-red-500">*</span></label>
                            <input pInputText id="roundDigits" name="roundDigits" type="text" placeholder="Round Digits" [(ngModel)]="currency.rounding_digits" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.rounding_digits }" />
                            <small *ngIf="submitted && !currency.rounding_digits" class="text-red-500">Rounding Digits is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="displayOrder">Order <span class="text-red-500">*</span></label>
                            <input pInputText id="displayOrder" name="roundDigits" type="text" placeholder="Order" [(ngModel)]="currency.display_order" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.display_order }" />
                            <small *ngIf="submitted && !currency.display_order" class="text-red-500">Order is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="status">Status</label>
                            <p-select id="status" name="status" [(ngModel)]="currency.currency_status" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="currency.description" class="w-full"></textarea>
                    </div>

                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['CUR','save']" type="submit" label="Create New" icon="pi pi-plus-circle" [disabled]="Form.invalid" />
                            <p-button *hasFeaturePermission="['CUR','cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </p-fluid>
        </form>
    `
})
export class AddCurrency {
    submitted = false; // Added submitted flag
    currency: CurrencyModel = {
        id: undefined,
        currency_code: '',
        currency_char: '',
        currency_number: '',
        currency_name: '',
        local_currency_name: '',
        currency_symbol: '',
        decimal_digits: undefined,
        rounding_digits: undefined,
        display_order: undefined,
        currency_status: undefined,
        description: ''
    };

    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Inactive', code: 'I' }
    ];

    constructor(
        private router: Router,
        private currencyService: CurrencyService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/currency']);
    }

    save() {
        this.submitted = true; // Set submitted flag

        if (!this.currency.currency_code ||
            !this.currency.currency_char ||
            !this.currency.currency_number ||
            !this.currency.currency_name ||
            !this.currency.local_currency_name ||
            !this.currency.currency_symbol ||
            !this.currency.decimal_digits ||
            !this.currency.rounding_digits ||
            this.currency.display_order === null ||
            this.currency.display_order === undefined
        ) {
            return; // don't proceed if required field is missing
        }

        this.currencyService.addCurrency(this.currency).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Role Permission created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Role Permission creation failed.'
                });
            }
        });
    }
}
