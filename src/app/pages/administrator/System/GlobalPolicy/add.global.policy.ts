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
import { MessagesComponent } from '../../../message/message';
import { DatePicker } from 'primeng/datepicker';

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
        DatePicker,
        MessagesComponent,
        HasPermissionDirective
    ],
    template: `

        <app-messages></app-messages>

        <form #form="ngForm" (ngSubmit)="saveGlobalPolicy()" novalidate>

            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Add New Global Policy</div>
                <div class="border-t border-gray-200 my-4"></div>

                <!-- Policy Code & Name -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyCode">Policy Code</label>
                        <input pInputText id="policyCode" name="policyCode" type="text" placeholder="Auto"
                               [readOnly]="true" [(ngModel)]="globalPolicy.policy_code" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyName">Policy Name <span class="text-red-500">*</span></label>
                        <input pInputText id="policyName" name="policyName" type="text"
                               [(ngModel)]="globalPolicy.policy_name" required class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.policy_name }" />
                        <small *ngIf="submitted && !globalPolicy.policy_name" class="text-red-500">Policy Name is required.</small>
                    </div>
                </div>

                <!-- Valid From & Valid To -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="validFrom">Valid from <span class="text-red-500">*</span></label>
                        <p-date-picker id="validFrom" name="validFrom" [showIcon]="true"  dateFormat="dd/mm/yy"
                                    [(ngModel)]="globalPolicy.valid_from" required class="w-full"
                                    [style]="{ 'width': '50%' }"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.valid_from }"></p-date-picker>
                        <small *ngIf="submitted && !globalPolicy.valid_from" class="text-red-500">Valid from is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="validTo">Valid to <span class="text-red-500">*</span></label>
                        <p-date-picker id="validTo" name="validTo" [showIcon]="true" [showButtonBar]="true" dateFormat="dd/mm/yy"
                                    [(ngModel)]="globalPolicy.valid_to" required class="w-full"
                                    [style]="{ 'width': '50%' }"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.valid_to }"></p-date-picker>
                        <small *ngIf="submitted && !globalPolicy.valid_to" class="text-red-500">Valid to is required.</small>
                    </div>
                </div>

                <!-- Password & Complexity -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberDuplicatedPassword">Number of duplicated passwords <span class="text-red-500">*</span></label>
                        <input pInputText id="numberDuplicatedPassword" name="numberDuplicatedPassword" type="number"
                               [(ngModel)]="globalPolicy.number_duplicated_password" class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.number_duplicated_password }" />
                        <small *ngIf="submitted && !globalPolicy.number_duplicated_password" class="text-red-500">Number is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="dayPasswordExpired">Days of password expired</label>
                        <input pInputText id="dayPasswordExpired" name="dayPasswordExpired" type="number"
                               [(ngModel)]="globalPolicy.day_password_expired" class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="minimumPasswordLength">Minimum password length</label>
                        <input pInputText id="minimumPasswordLength" name="minimumPasswordLength" type="number"
                               [(ngModel)]="globalPolicy.minimum_password_length" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="complexedPassword">Complexed password?</label>
                        <p-dropdown id="complexedPassword" name="complexedPassword" [(ngModel)]="globalPolicy.complexed_password"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One"
                                    class="w-full"></p-dropdown>
                    </div>
                </div>

                <!-- Lower/Upper/Symbol/Number -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedLowerCaseLetter">Include lower case letter</label>
                        <p-dropdown id="includedLowerCaseLetter" name="includedLowerCaseLetter"
                                    [(ngModel)]="globalPolicy.included_lower_case_letter" [options]="dropdownItems" optionLabel="name"
                                    optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedUpperCaseLetter">Include upper case letter</label>
                        <p-dropdown id="includedUpperCaseLetter" name="includedUpperCaseLetter"
                                    [(ngModel)]="globalPolicy.included_upper_case_letter" [options]="dropdownItems" optionLabel="name"
                                    optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedSymbolCharacter">Include symbol character</label>
                        <p-dropdown id="includedSymbolCharacter" name="includedSymbolCharacter"
                                    [(ngModel)]="globalPolicy.included_symbol_character" [options]="dropdownItems" optionLabel="name"
                                    optionValue="value" placeholder="Select One" class="w-full"></p-dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedNumber">Include number</label>
                        <p-dropdown id="includedNumber" name="includedNumber" [(ngModel)]="globalPolicy.included_number"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value" placeholder="Select One"
                                    class="w-full"></p-dropdown>
                    </div>
                </div>

                <!-- Login Time -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginFrom">Can login from <span class="text-red-500">*</span></label>
                        <p-calendar id="canLoginFrom" name="canLoginFrom" [(ngModel)]="globalPolicy.can_login_from"
                                    [showIcon]="true" [showButtonBar]="true" [timeOnly]="true" hourFormat="12" class="w-full"
                                    [style]="{ 'width': '50%' }"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.can_login_from }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.can_login_from" class="text-red-500">Time is required.</small>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginTo">Can login to <span class="text-red-500">*</span></label>
                        <p-calendar id="canLoginTo" name="canLoginTo" [(ngModel)]="globalPolicy.can_login_to"
                                    [showIcon]="true" [showButtonBar]="true" [timeOnly]="true" hourFormat="12" class="w-full"
                                    [style]="{ 'width': '50%' }"
                                    [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.can_login_to }"></p-calendar>
                        <small *ngIf="submitted && !globalPolicy.can_login_to" class="text-red-500">Time is required.</small>
                    </div>
                </div>

                <!-- Failed Login & Description -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberFailedLoginAttempts">Number of failed login attempts <span class="text-red-500">*</span></label>
                        <input pInputText id="numberFailedLoginAttempts" name="numberFailedLoginAttempts" type="number"
                               [(ngModel)]="globalPolicy.number_failed_login_attempts" class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.number_failed_login_attempts }" />
                        <small *ngIf="submitted && !globalPolicy.number_failed_login_attempts" class="text-red-500">Number is required.</small>
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
        policy_code: '',
        policy_name: '',
        valid_from: undefined,
        valid_to: undefined,
        number_duplicated_password: undefined,
        day_password_expired: undefined,
        minimum_password_length: undefined,
        complexed_password: undefined,
        included_lower_case_letter: undefined,
        included_upper_case_letter: undefined,
        included_symbol_character: undefined,
        included_number: undefined,
        can_login_from: undefined,
        can_login_to: undefined,
        number_failed_login_attempts: undefined,
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

        if (!this.globalPolicy.policy_name ||
            !this.globalPolicy.valid_from ||
            !this.globalPolicy.valid_to ||
            !this.globalPolicy.number_duplicated_password ||
            !this.globalPolicy.can_login_from ||
            !this.globalPolicy.can_login_to ||
            !this.globalPolicy.number_failed_login_attempts) {
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

        if (payload.can_login_from instanceof Date) {
            payload.can_login_from = this.formatTimeForBackend(payload.can_login_from);
        }

        if (payload.can_login_to instanceof Date) {
            payload.can_login_to = this.formatTimeForBackend(payload.can_login_to);
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
