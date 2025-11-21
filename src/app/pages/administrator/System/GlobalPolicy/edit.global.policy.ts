// edit-global-policy.component.ts
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
import { DatePicker } from 'primeng/datepicker';

import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { GlobalPolicyService } from '../../../service/administrator/system/global.policy.service';
import { GlobalPolicyModel } from '../../../model/administrator/system/global.policy.model';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';

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
        InputTextarea,
        CalendarModule,
        DatePicker,
        MessagesComponent,
        HasPermissionDirective
    ],
    template: `

        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="saveGlobalPolicy()" novalidate>

            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Edit Global Policy</div>
                <div class="border-t border-gray-200 my-4"></div>

                <!-- Policy Code & Name -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyCode">Policy Code</label>
                        <input pInputText id="policyCode" name="policyCode" type="text"
                               placeholder="Auto"
                               [readOnly]="true"
                               [(ngModel)]="globalPolicy.policy_code"
                               class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="policyName">Policy Name <span class="text-red-500">*</span></label>
                        <input pInputText id="policyName" name="policyName" type="text"
                               [(ngModel)]="globalPolicy.policy_name"
                               required
                               class="w-full"
                               [ngClass]="{ 'ng-invalid ng-dirty': submitted && !globalPolicy.policy_name }" />
                        <small *ngIf="submitted && !globalPolicy.policy_name" class="text-red-500">
                            Policy Name is required.
                        </small>
                    </div>
                </div>

                <!-- Valid From & Valid To -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="validFrom">Valid from <span class="text-red-500">*</span></label>
                        <p-datepicker id="validFrom"
                                      name="validFrom"
                                      [showIcon]="true"
                                      [(ngModel)]="globalPolicy.valid_from"
                                      dateFormat="dd/mm/yy"
                                      required
                                      [style]="{ 'width': '50%' }"
                                      class="w-full">
                        </p-datepicker>
                        <small *ngIf="submitted && !globalPolicy.valid_from" class="text-red-500">
                            Valid from is required.
                        </small>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="validTo">Valid to <span class="text-red-500">*</span></label>
                        <p-datepicker id="validTo"
                                      name="validTo"
                                      [showIcon]="true"
                                      [(ngModel)]="globalPolicy.valid_to"
                                      dateFormat="dd/mm/yy"
                                      required
                                      [style]="{ 'width': '50%' }"
                                      class="w-full">
                        </p-datepicker>
                        <small *ngIf="submitted && !globalPolicy.valid_to" class="text-red-500">
                            Valid to is required.
                        </small>
                    </div>
                </div>

                <!-- Number of duplicated passwords & Days password expired -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberDuplicatedPassword">Number of duplicated passwords</label>
                        <input pInputText id="numberDuplicatedPassword" name="numberDuplicatedPassword"
                               type="number" [(ngModel)]="globalPolicy.number_duplicated_password" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="dayPasswordExpired">Days of password expired</label>
                        <input pInputText id="dayPasswordExpired" name="dayPasswordExpired"
                               type="number" [(ngModel)]="globalPolicy.day_password_expired" class="w-full" />
                    </div>
                </div>

                <!-- Password complexity dropdowns -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="minimumPasswordLength">Minimum password length</label>
                        <input pInputText id="minimumPasswordLength" name="minimumPasswordLength"
                               type="number" [(ngModel)]="globalPolicy.minimum_password_length" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="complexedPassword">Complexed password?</label>
                        <p-dropdown id="complexedPassword" name="complexedPassword"
                                    [(ngModel)]="globalPolicy.complexed_password"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value"
                                    placeholder="Select One" class="w-full">
                        </p-dropdown>
                    </div>
                </div>

                <!-- Other dropdowns -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedLowerCaseLetter">Include lower case letter</label>
                        <p-dropdown id="includedLowerCaseLetter" name="includedLowerCaseLetter"
                                    [(ngModel)]="globalPolicy.included_lower_case_letter"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value"
                                    placeholder="Select One" class="w-full">
                        </p-dropdown>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedUpperCaseLetter">Include upper case letter</label>
                        <p-dropdown id="includedUpperCaseLetter" name="includedUpperCaseLetter"
                                    [(ngModel)]="globalPolicy.included_upper_case_letter"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value"
                                    placeholder="Select One" class="w-full">
                        </p-dropdown>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedSymbolCharacter">Include symbol character</label>
                        <p-dropdown id="includedSymbolCharacter" name="includedSymbolCharacter"
                                    [(ngModel)]="globalPolicy.included_symbol_character"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value"
                                    placeholder="Select One" class="w-full">
                        </p-dropdown>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="includedNumber">Include number</label>
                        <p-dropdown id="includedNumber" name="includedNumber"
                                    [(ngModel)]="globalPolicy.included_number"
                                    [options]="dropdownItems" optionLabel="name" optionValue="value"
                                    placeholder="Select One" class="w-full">
                        </p-dropdown>
                    </div>
                </div>

                <!-- Login From/To time -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginFrom">Can login from</label>
                        <p-calendar id="canLoginFrom" name="canLoginFrom"
                                    [(ngModel)]="globalPolicy.can_login_from"
                                    [showIcon]="true" [showButtonBar]="true"
                                    [timeOnly]="true" hourFormat="12"
                                    [style]="{ 'width': '50%' }"
                                    class="w-full">
                        </p-calendar>
                    </div>

                    <div class="flex flex-col gap-2 w-full">
                        <label for="canLoginTo">Can login to</label>
                        <p-calendar id="canLoginTo" name="canLoginTo"
                                    [(ngModel)]="globalPolicy.can_login_to"
                                    [showIcon]="true" [showButtonBar]="true"
                                    [timeOnly]="true" hourFormat="12"
                                    [style]="{ 'width': '50%' }"
                                    class="w-full">
                        </p-calendar>
                    </div>
                </div>

                <!-- Number of failed login attempts & Description -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-col gap-2 w-full">
                        <label for="numberFailedLoginAttempts">Number of failed login attempts</label>
                        <input pInputText id="numberFailedLoginAttempts" name="numberFailedLoginAttempts"
                               type="number" [(ngModel)]="globalPolicy.number_failed_login_attempts" class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="policyDescription">Description</label>
                    <textarea pInputTextarea id="policyDescription" name="policyDescription"
                              rows="4" [(ngModel)]="globalPolicy.description" class="w-full"></textarea>
                </div>

                <div class="flex gap-2 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['SYP', 'save']" type="submit" label="Save" icon="pi pi-check" [disabled]="Form.invalid" />
                        <p-button *hasFeaturePermission="['SYP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </form>
    `
})
export class EditGlobalPolicy {
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
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['globalPolicy']) {
            const policy = { ...navigation.extras.state['globalPolicy'] };

            // Convert string dates from backend to Date objects
            policy.valid_from = policy.valid_from ? new Date(policy.valid_from) : undefined;
            policy.valid_to = policy.valid_to ? new Date(policy.valid_to) : undefined;

            // Normalize dropdowns
            policy.complexed_password = !!policy.complexed_password?.value;
            policy.included_lower_case_letter = !!policy.included_lower_case_letter?.value;
            policy.included_upper_case_letter = !!policy.included_upper_case_letter?.value;
            policy.included_symbol_character = !!policy.included_symbol_character?.value;
            policy.included_number = !!policy.included_number?.value;

            // Convert time strings to Date objects for p-calendar
            policy.can_login_from = this.parseTimeToDate(policy.can_login_from as unknown as string);
            policy.can_login_to = this.parseTimeToDate(policy.can_login_to as unknown as string);

            this.globalPolicy = policy;
        }

        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    goBack() {
        this.router.navigate(['/global-policy']);
    }

    saveGlobalPolicy() {
        this.submitted = true;
        if (!this.globalPolicy.policy_name) return;

        const payload = this.preparePayload();

        this.globalPolicyService.updateGlobalPolicy(payload).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Global Policy updated successfully!'
                });
                this.goBack();
            },
            error: (err) => {
                console.error('Update error', err);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Global Policy update failed: ' + (err.error?.message || err.message)
                });
            }
        });
    }

    private preparePayload(): any {
        const payload = { ...this.globalPolicy };

        // Convert time-only fields back to "HH:mm:ss"
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
        return `${hours}:${minutes}`;
    }

    private parseTimeToDate(timeStr?: string): Date | undefined {
        if (!timeStr) return undefined;
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds || 0, 0);
        return date;
    }
}
