// add-global-policy.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea'; // Fixed import
import { CalendarModule } from 'primeng/calendar';

import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { GlobalPolicyService } from '../../../service/administrator/system/global.policy.service';
import { GlobalPolicy } from '../../../model/administrator/system/GlobalPolicy';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message';

@Component({
    selector: 'app-edit-global-policy',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        ButtonGroupModule,
        DropdownModule,
        InputTextarea, // Fixed - use the component/directive directly
        CalendarModule,
        Message,
        HasPermissionDirective
    ],
    template: `
        <form #Form="ngForm" (ngSubmit)="saveGlobalPolicy()" novalidate>
            <div class="fixed top-3/1 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Edit Global Policy</div>
                <div class="border-t border-gray-200 my-4"></div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyCode">Policy Code</label>
                        <input pInputText id="policyCode" name="policyCode" type="text" placeholder="Auto" [readOnly]="true" [(ngModel)]="globalPolicy.policyCode" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyName">Policy Name <span class="text-red-500">*</span></label>
                        <input pInputText id="policyName" name="policyName" type="text" [(ngModel)]="globalPolicy.policyName" required class="w-full" [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.policyName }" />
                        <small *ngIf="submitted && !globalPolicy.policyName" class="text-red-500">Policy Name is required.</small>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="validFrom">Valid from <span class="text-red-500">*</span></label>
                        <p-calendar id="validFrom" name="validFrom" [showIcon]="true" [showButtonBar]="true" [(ngModel)]="globalPolicy.validFrom" dateFormat="dd/mm/yy" required class="w-full" [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.validFrom }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.validFrom" class="text-red-500">Valid from is required.</small>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="validTo">Valid to <span class="text-red-500">*</span></label>
                        <p-calendar id="validTo" name="validTo" [showIcon]="true" [showButtonBar]="true" [(ngModel)]="globalPolicy.validTo" dateFormat="dd/mm/yy" required class="w-full" [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.validTo }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.validTo" class="text-red-500">Valid to is required.</small>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberDuplicatedPassword">Number of duplicated passwords</label>
                        <input pInputText id="numberDuplicatedPassword" name="numberDuplicatedPassword" type="number" [(ngModel)]="globalPolicy.numberDuplicatedPassword" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="dayPasswordExpired">Days of password expired</label>
                        <input pInputText id="dayPasswordExpired" name="dayPasswordExpired" type="number" [(ngModel)]="globalPolicy.dayPasswordExpired" class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="minimumPasswordLength">Minimum password length</label>
                        <input pInputText id="minimumPasswordLength" name="minimumPasswordLength" type="number" [(ngModel)]="globalPolicy.minimumPasswordLength" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="complexedPassword">Complexed password?</label>
                        <p-dropdown id="complexedPassword" name="complexedPassword" [(ngModel)]="globalPolicy.complexedPassword" [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedLowerCaseLetter">Include lower case letter</label>
                        <p-dropdown id="includedLowerCaseLetter" name="includedLowerCaseLetter" [(ngModel)]="globalPolicy.includedLowerCaseLetter" [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedUpperCaseLetter">Include upper case letter</label>
                        <p-dropdown id="includedUpperCaseLetter" name="includedUpperCaseLetter" [(ngModel)]="globalPolicy.includedUpperCaseLetter" [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedSymbolCharacter">Include symbol character</label>
                        <p-dropdown id="includedSymbolCharacter" name="includedSymbolCharacter" [(ngModel)]="globalPolicy.includedSymbolCharacter" [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedNumber">Include number</label>
                        <p-dropdown id="includedNumber" name="includedNumber" [(ngModel)]="globalPolicy.includedNumber" [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginFrom">Can login from</label>
                        <p-calendar id="canLoginFrom" name="canLoginFrom" [(ngModel)]="globalPolicy.canLoginFrom" [showIcon]="true" [showButtonBar]="true" [timeOnly]="true" hourFormat="24" class="w-full"></p-calendar>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginTo">Can login to</label>
                        <p-calendar id="canLoginTo" name="canLoginTo" [(ngModel)]="globalPolicy.canLoginTo" [showIcon]="true" [showButtonBar]="true" [timeOnly]="true" hourFormat="24" class="w-full"></p-calendar>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberFailedLoginAttempts">Number of failed login attempts</label>
                        <input pInputText id="numberFailedLoginAttempts" name="numberFailedLoginAttempts" type="number" [(ngModel)]="globalPolicy.numberFailedLoginAttempts" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <!-- Empty for alignment -->
                    </div>
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="policyDescription">Description</label>
                    <textarea pInputTextarea id="policyDescription" name="policyDescription" rows="4" [(ngModel)]="globalPolicy.description" class="w-full"></textarea>
                </div>

                <div class="flex gap-2 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['SYP','save']" type="submit" label="Save" icon="pi pi-check" [disabled]="Form.invalid" />
                        <p-button *hasFeaturePermission="['SYP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </form>
    `
})
export class EditGlobalPolicy {
    submitted = false;

    globalPolicy: GlobalPolicy = {
        policyCode: '',
        policyName: '',
        validFrom: undefined,
        validTo: undefined,
        numberDuplicatedPassword: undefined,
        dayPasswordExpired: undefined,
        minimumPasswordLength: undefined,
        complexedPassword: true,
        includedLowerCaseLetter: true,
        includedUpperCaseLetter: true,
        includedSymbolCharacter: true,
        includedNumber: true,
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
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['globalPolicy']) {
            this.globalPolicy = { ...navigation.extras.state['globalPolicy'] };
        };
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/global-policy']);
    }

    saveGlobalPolicy() {
        this.submitted = true;

        if (!this.globalPolicy.policyName) {
            return;
        }

        const payload = this.preparePayload();

        this.globalPolicyService.updateGlobalPolicy(payload).subscribe({
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

        return `${hours}:${minutes}:${seconds}`;
    }
}
