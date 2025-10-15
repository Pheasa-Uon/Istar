import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ButtonGroup } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { HolidayModel } from '../../../model/administrator/systemAdmin/holiday.model';
import { HolidayService } from '../../../service/administrator/systemAdmin/holiday.service';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { Calendar } from 'primeng/calendar';

@Component({
    selector: 'app-add-holiday',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TextareaModule, ButtonGroup, MessagesComponent, HasPermissionDirective, DialogModule, DatePickerModule, Calendar],
    template: `
        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="save()" novalidate>
            <div class="p-fluid">
                <div class="card flex flex-col gap-6 w-full p-4">
                    <div class="font-semibold text-xl">Add New Holiday</div>

                    <div class="border-t border-gray-200 my-4"></div>

                    <!-- Holiday date & Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col w-full">
                            <label for="holidayDate">Holiday Date <span class="text-red-500">*</span></label>

                            <p-datepicker
                                id="holidayDate"
                                name="holidayDate"
                                [showIcon]="true"
                                [showButtonBar]="true"
                                dateFormat="dd/mm/yy"
                                [(ngModel)]="holiday.holiday_date"
                                required
                                class="w-full"
                                [ngClass]="{ 'ng-invalid ng-dirty': submitted && !holiday.holiday_date }"
                            ></p-datepicker>

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
                            <p-button *hasFeaturePermission="['CAL', 'save']" type="submit" label="Create New" icon="pi pi-plus-circle" [disabled]="Form.invalid"></p-button>
                            <p-button *hasFeaturePermission="['CAL', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </div>
        </form>
    `
})
export class AddHolidayComponent implements OnInit {
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
        private messageService: MessageService
    ) {}

    ngOnInit(): void {}

    goBack() {
        this.router.navigate(['/calendar']);
    }

    save() {
        this.submitted = true;

        if (!this.holiday.holiday_date || !this.holiday.holiday_name) {
            return;
        }

        this.holidayService.addHoliday(this.holiday).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Holiday created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: (error) => {
                console.error('Error creating holiday:', error);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Holiday creation failed. Please try again.'
                });
            }
        });
    }
}
