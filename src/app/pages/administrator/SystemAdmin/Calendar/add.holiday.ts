import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ButtonGroup, ButtonGroupModule } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { HolidayModel } from '../../../model/administrator/systemAdmin/holiday.model';
import { HolidayService } from '../../../service/administrator/systemAdmin/holiday.service';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-add-holiday',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        TextareaModule,
        ButtonGroup,
        MessagesComponent,
        HasPermissionDirective,
        DialogModule,
        CalendarModule
    ],
    template: `
        <app-messages></app-messages>

        <p-dialog
            header="Add New Holiday"
            [(visible)]="holidayDialog"
            [modal]="true"
            [closable]="false"
            [style]="{ width: '400px', height: '470px' }"
        >
            <form #Form="ngForm" (ngSubmit)="save()" novalidate class="flex flex-col gap-4">
                <div class="flex flex-col w-full">
                    <label for="holiday_date" class="font-semibold">Holiday Date <span class="text-red-500">*</span></label>
                    <p-calendar
                        id="holiday_date"
                        name="holiday_date"
                        [(ngModel)]="holiday.holiday_date"
                        [showIcon]="true"
                        dateFormat="dd/mm/yy"
                        required
                        class="w-full"
                        [ngClass]="{ 'ng-invalid ng-dirty': submitted && !holiday.holiday_date }"
                    ></p-calendar>
                    <small *ngIf="submitted && !holiday.holiday_date" class="text-red-500">Holiday date is required.</small>
                </div>

                <div>
                    <label for="holiday_name" class="font-semibold">Holiday Name <span class="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="holiday_name"
                        pInputText
                        [(ngModel)]="holiday.holiday_name"
                        name="holiday_name"
                        required
                        class="w-full"
                        [ngClass]="{ 'ng-invalid ng-dirty': submitted && !holiday.holiday_name }"
                    />
                    <small *ngIf="submitted && !holiday.holiday_name" class="text-red-500">Holiday name is required.</small>
                </div>

                <div>
                    <label for="description" class="font-semibold">Description</label>
                    <textarea
                        id="description"
                        pTextarea
                        [(ngModel)]="holiday.description"
                        name="description"
                        rows="10"
                        class="w-full"
                    ></textarea>
                </div>

                <div class="flex gap-2 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['SYP', 'save']" type="submit" label="Create New"
                                  icon="pi pi-plus-circle" [disabled]="Form.invalid"></p-button>
                        <p-button *hasFeaturePermission="['SYP', 'cancel']" label="Cancel" icon="pi pi-times"
                                  (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </form>
        </p-dialog>
    `
})
export class AddHolidayComponent implements OnInit {
    submitted = false;
    holidayDialog = true;

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
