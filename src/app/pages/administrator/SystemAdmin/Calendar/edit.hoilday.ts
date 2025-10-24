import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ButtonGroup } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message'; // adjust path if needed
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HolidayModel } from '../../../model/administrator/systemAdmin/holiday.model';
import { HolidayService } from '../../../service/administrator/systemAdmin/holiday.service';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-edit-holiday',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Textarea, ButtonGroup, MessagesComponent, HasPermissionDirective, CalendarModule, DatePickerModule],
    template: `
        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="save()" novalidate>
            <div class="p-fluid">
                <div class="card flex flex-col gap-6 w-full p-4">
                    <div class="font-semibold text-xl">Edit Holiday</div>

                    <div class="border-t border-gray-200 my-4"></div>

                    <!-- Holiday date & Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col w-full">
                            <label for="holidayDate">Holiday Date <span class="text-red-500">*</span></label>

                            <p-date-picker
                                id="holidayDate"
                                name="holidayDate"
                                [showIcon]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="holiday.holiday_date"
                                required
                                class="w-full"
                                [style]="{ 'width': '50%' }"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !holiday.holiday_date }"
                            ></p-date-picker>

                            <small *ngIf="submitted && !holiday.holiday_date" class="text-red-500"> Holiday date is required. </small>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="holidayName">Holiday Name <span class="text-red-500">*</span></label>
                            <input pInputText id="holidayName" name="holidayName" type="text" placeholder="Holiday name" [(ngModel)]="holiday.holiday_name" required class="w-full" [ngClass]="{ 'p-invalid': submitted && !holiday.holiday_name }" />
                            <small *ngIf="submitted && !holiday.holiday_name" class="text-red-500">Holiday name is required.</small>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-col gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="holiday.description" class="w-full"></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['CAL', 'save']" type="submit" label="Save" icon="pi pi-check" [disabled]="Form.invalid" />
                            <p-button *hasFeaturePermission="['CAL', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </div>
        </form>
    `
})
export class EditHolidayComponent implements OnInit {
    submitted = false;

    holiday: HolidayModel = {
        id: undefined,
        holiday_date: '',
        holiday_name: '',
        description: ''
    };

    constructor(
        private router: Router,
        private holidayService: HolidayService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['holiday']) {
            const holiday = { ...navigation.extras.state['holiday'] };

            holiday.holiday_date = holiday.holiday_date ? new Date(holiday.holiday_date) : undefined;

            this.holiday = holiday;
        }

        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {}

    goBack() {
        this.router.navigate(['/calendar']);
    }

    save() {
        this.submitted = true;

        if (!this.holiday.holiday_name) {
            this.messageService.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Department name is required.'
            });
            return;
        }

        this.holidayService.updateHoliday(this.holiday).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Country updated successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Country update failed.'
                });
            }
        });
    }
}
