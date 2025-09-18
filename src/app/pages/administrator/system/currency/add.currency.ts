import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message';
import { ButtonGroup } from 'primeng/buttongroup';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { CurrencyService } from '../../../service/administrator/system/currency.service';
import { Currency } from '../../../model/administrator/system/Currency';

@Component({
    selector: 'app-add-currency',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        TextareaModule,
        Message,
        ButtonGroup,
        Fluid,
        Select,
        HasPermissionDirective
    ],
    template: `
        <form #Form="ngForm" (ngSubmit)="save()" novalidate>
            <div class="fixed top-3/1 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Add New Currency</div>
                    <div class="border-t border-gray-200 my-4"></div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyId">Currency Code <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyId" name="currencyCode" type="text" placeholder="Currency Code" [(ngModel)]="currency.currencyCode" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currencyCode }"/>
                            <small *ngIf="submitted && !currency.currencyCode" class="text-red-500">Currency code is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyChar">Currency Char <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyChar" name="currencyChar" type="text" placeholder="Currency Char"  [(ngModel)]="currency.currencyChar" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currencyChar }" />
                            <small *ngIf="submitted && !currency.currencyChar" class="text-red-500">Currency char is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyNumber">Currency Number <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyNumber" name="currencyNumber" type="text" placeholder="Currency Number" [(ngModel)]="currency.currencyNumber" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currencyNumber }"/>
                            <small *ngIf="submitted && !currency.currencyNumber" class="text-red-500">Currency number is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencySymbol">Currency Symbol <span class="text-red-500">*</span></label>
                            <input pInputText id="currencySymbol" name="currencySymbol" type="text" placeholder="Currency Symbol" [(ngModel)]="currency.currencySymbol" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currencySymbol }" />
                            <small *ngIf="submitted && !currency.currencySymbol" class="text-red-500">Currency char is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="currencyName">Currency Name <span class="text-red-500">*</span></label>
                            <input pInputText id="currencyName" name="currencyName" type="text" placeholder="Currency Name" [(ngModel)]="currency.currencyName" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.currencyName }"/>
                            <small *ngIf="submitted && !currency.currencyName" class="text-red-500">Currency name is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="localCurrencyName">Local Currency Name <span class="text-red-500">*</span></label>
                            <input pInputText id="localCurrencyName" name="localCurrencyName" type="text" placeholder="Local Currency Name" [(ngModel)]="currency.localCurrencyName" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.localCurrencyName }" />
                            <small *ngIf="submitted && !currency.localCurrencyName" class="text-red-500">Local currency name is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="decimalDigits">Decimal Digits <span class="text-red-500">*</span></label>
                            <input pInputText id="decimalDigits" name="decimalDigits" type="text" placeholder="Decimal Digits" [(ngModel)]="currency.decimalDigits" class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.decimalDigits }"/>
                            <small *ngIf="submitted && !currency.decimalDigits" class="text-red-500">Decimal Digits is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="roundDigits">Rounding Digits <span class="text-red-500">*</span></label>
                            <input pInputText id="roundDigits" name="roundDigits" type="text" placeholder="Round Digits" [(ngModel)]="currency.roundingDigits" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.roundingDigits }" />
                            <small *ngIf="submitted && !currency.roundingDigits" class="text-red-500">Rounding Digits is required.</small>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="displayOrder">Order <span class="text-red-500">*</span></label>
                            <input pInputText id="displayOrder" name="roundDigits" type="text" placeholder="Order" [(ngModel)]="currency.displayOrder" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !currency.displayOrder }" />
                            <small *ngIf="submitted && !currency.displayOrder" class="text-red-500">Order is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="status">Status</label>
                            <p-select id="status" name="status" [(ngModel)]="currency.currencyStatus" [options]="dropdownItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
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
    currency: Currency = {
        id: undefined,
        currencyCode: '',
        currencyChar: '',
        currencyNumber: '',
        currencyName: '',
        localCurrencyName: '',
        currencySymbol: '',
        decimalDigits: undefined,
        roundingDigits: undefined,
        displayOrder: undefined,
        currencyStatus: 'A',
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
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/currency']);
    }

    save() {
        this.submitted = true; // Set submitted flag

        if (!this.currency.currencyCode ||
            !this.currency.currencyChar ||
            !this.currency.currencyNumber ||
            !this.currency.currencyName ||
            !this.currency.localCurrencyName ||
            !this.currency.currencySymbol ||
            !this.currency.decimalDigits ||
            !this.currency.roundingDigits ||
            this.currency.displayOrder === null ||
            this.currency.displayOrder === undefined
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
