// add-global-policy.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { GlobalPolicyService } from '../../../service/administrator/system/global.policy.service';
import { GlobalPolicyModel } from '../../../model/administrator/system/global.policy.model';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message';

@Component({
    selector: 'app-add-global-policy',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        ButtonGroupModule,
        DropdownModule,
        InputTextarea,
        CalendarModule,
        Message,
        HasPermissionDirective
    ],
    template: `
        <form #form="ngForm" (ngSubmit)="saveGlobalPolicy()" novalidate>
            <div class="fixed top-3/1 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Add New Global Policy</div>
                <div class="border-t border-gray-200 my-4"></div>

                <!-- Policy Code & Name -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyCode">Policy Code</label>
                        <input pInputText id="policyCode" name="policyCode" type="text" placeholder="Auto"
                               [readOnly]="true" [(ngModel)]="globalPolicy.policyCode" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyName">Policy Name <span class="text-red-500">*</span></label>
                        <input pInputText id="policyName" name="policyName" type="text"
                               [(ngModel)]="globalPolicy.policyName" required class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.policyName }" />
                        <small *ngIf="submitted && !globalPolicy.policyName" class="text-red-500">Policy Name is required.</small>
                    </div>
                </div>

                <!-- Valid From & Valid To -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="validFrom">Valid from <span class="text-red-500">*</span></label>
                        <p-calendar id="validFrom" name="validFrom" [showIcon]="true" [showButtonBar]="true" dateFormat="dd/mm/yy"
                                    [(ngModel)]="globalPolicy.validFrom" required class="w-full"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.validFrom }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.validFrom" class="text-red-500">Valid from is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="validTo">Valid to <span class="text-red-500">*</span></label>
                        <p-calendar id="validTo" name="validTo" [showIcon]="true" [showButtonBar]="true" dateFormat="dd/mm/yy"
                                    [(ngModel)]="globalPolicy.validTo" required class="w-full"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.validTo }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.validTo" class="text-red-500">Valid to is required.</small>
                    </div>
                </div>

                <!-- Password & Complexity -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberDuplicatedPassword">Number of duplicated passwords <span class="text-red-500">*</span></label>
                        <input pInputText id="numberDuplicatedPassword" name="numberDuplicatedPassword" type="number"
                               [(ngModel)]="globalPolicy.numberDuplicatedPassword" class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.numberDuplicatedPassword }" />
                        <small *ngIf="submitted && !globalPolicy.numberDuplicatedPassword" class="text-red-500">Number is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="dayPasswordExpired">Days of password expired</label>
                        <input pInputText id="dayPasswordExpired" name="dayPasswordExpired" type="number"
                               [(ngModel)]="globalPolicy.dayPasswordExpired" class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="minimumPasswordLength">Minimum password length</label>
                        <input pInputText id="minimumPasswordLength" name="minimumPasswordLength" type="number"
                               [(ngModel)]="globalPolicy.minimumPasswordLength" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="complexedPassword">Complexed password?</label>
                        <p-dropdown id="complexedPassword" name="complexedPassword" [(ngModel)]="globalPolicy.complexedPassword"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One"
                                    class="w-full"></p-dropdown>
                    </div>
                </div>

                <!-- Lower/Upper/Symbol/Number -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedLowerCaseLetter">Include lower case letter</label>
                        <p-dropdown id="includedLowerCaseLetter" name="includedLowerCaseLetter"
                                    [(ngModel)]="globalPolicy.includedLowerCaseLetter" [options]="dropdownItems" optionLabel="name"
                                    optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedUpperCaseLetter">Include upper case letter</label>
                        <p-dropdown id="includedUpperCaseLetter" name="includedUpperCaseLetter"
                                    [(ngModel)]="globalPolicy.includedUpperCaseLetter" [options]="dropdownItems" optionLabel="name"
                                    optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedSymbolCharacter">Include symbol character</label>
                        <p-dropdown id="includedSymbolCharacter" name="includedSymbolCharacter"
                                    [(ngModel)]="globalPolicy.includedSymbolCharacter" [options]="dropdownItems" optionLabel="name"
                                    optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedNumber">Include number</label>
                        <p-dropdown id="includedNumber" name="includedNumber" [(ngModel)]="globalPolicy.includedNumber"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One"
                                    class="w-full"></p-dropdown>
                    </div>
                </div>

                <!-- Login Time -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginFrom">Can login from <span class="text-red-500">*</span></label>
                        <p-calendar id="canLoginFrom" name="canLoginFrom" [(ngModel)]="globalPolicy.canLoginFrom"
                                    [showIcon]="true" [showButtonBar]="true" [timeOnly]="true" hourFormat="12" class="w-full"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.canLoginFrom }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.canLoginFrom" class="text-red-500">Time is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginTo">Can login to <span class="text-red-500">*</span></label>
                        <p-calendar id="canLoginTo" name="canLoginTo" [(ngModel)]="globalPolicy.canLoginTo"
                                    [showIcon]="true" [showButtonBar]="true" [timeOnly]="true" hourFormat="12" class="w-full"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.canLoginTo }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.canLoginTo" class="text-red-500">Time is required.</small>
                    </div>
                </div>

                <!-- Failed Login & Description -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberFailedLoginAttempts">Number of failed login attempts <span class="text-red-500">*</span></label>
                        <input pInputText id="numberFailedLoginAttempts" name="numberFailedLoginAttempts" type="number"
                               [(ngModel)]="globalPolicy.numberFailedLoginAttempts" class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.numberFailedLoginAttempts }" />
                        <small *ngIf="submitted && !globalPolicy.numberFailedLoginAttempts" class="text-red-500">Number is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full"></div>
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="policyDescription">Description</label>
                    <textarea pInputTextarea id="policyDescription" name="policyDescription" rows="4"
                              [(ngModel)]="globalPolicy.description" class="w-full"></textarea>
                </div>

                <div class="flex gap-2 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['SYP', 'save']" type="submit" label="Create New"
                                  icon="pi pi-plus-circle" [disabled]="form.invalid"></p-button>
                        <p-button *hasFeaturePermission="['SYP', 'cancel']" label="Cancel" icon="pi pi-times"
                                  (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </form>
    `
})
export class AddGlobalPolicy {
    submitted = false;

    globalPolicy: GlobalPolicyModel = {
        policyCode: '',
        policyName: '',
        validFrom: undefined,
        validTo: undefined,
        numberDuplicatedPassword: undefined,
        dayPasswordExpired: undefined,
        minimumPasswordLength: undefined,
        complexedPassword: undefined,
        includedLowerCaseLetter: undefined,
        includedUpperCaseLetter: undefined,
        includedSymbolCharacter: undefined,
        includedNumber: undefined,
        canLoginFrom: undefined,
        canLoginTo: undefined,
        numberFailedLoginAttempts: undefined,
        description: ''
    };

    dropdownItems = [
        { name: 'Yes', value: true },
        { name: 'No', value: false }
    ];

    constructor(
        private router: Router,
        private globalPolicyService: GlobalPolicyService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/global-policy']);
    }

    saveGlobalPolicy() {
        this.submitted = true;

        if (!this.globalPolicy.policyName ||
            !this.globalPolicy.validFrom ||
            !this.globalPolicy.validTo ||
            !this.globalPolicy.numberDuplicatedPassword ||
            !this.globalPolicy.canLoginFrom ||
            !this.globalPolicy.canLoginTo ||
            !this.globalPolicy.numberFailedLoginAttempts) {
            return;
        }

        const payload = this.preparePayload();

        this.globalPolicyService.addGlobalPolicy(payload).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Global Policy created successfully!'
                });
                this.goBack();
            },
            error: (err) => {
                console.error('Create error', err);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Global Policy creation failed: ' + (err.error?.message || err.message)
                });
            }
        });
    }

    private preparePayload(): any {
        const payload = { ...this.globalPolicy };

        if (payload.canLoginFrom instanceof Date) {
            payload.canLoginFrom = this.formatTimeForBackend(payload.canLoginFrom);
        }

        if (payload.canLoginTo instanceof Date) {
            payload.canLoginTo = this.formatTimeForBackend(payload.canLoginTo);
        }

        return payload;
    }

    private formatTimeForBackend(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
