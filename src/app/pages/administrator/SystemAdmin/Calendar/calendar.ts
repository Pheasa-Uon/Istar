import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';
import { WorkingDayModel } from '../../../model/administrator/systemAdmin/working.day.model';
import { WorkingDayService } from '../../../service/administrator/systemAdmin/working.day.service';
import {
    FeaturePermissionService
} from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { BranchModel } from '../../../model/administrator/systemAdmin/branch.model';
import { HolidayModel } from '../../../model/administrator/systemAdmin/holiday.model';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, TableModule, CheckboxModule, MessagesComponent, FormsModule, Button, Fluid, HasPermissionDirective, IconField, InputIcon, InputText, Dialog, Divider, ConfirmDialog],
    template: `
        <app-messages></app-messages>

        <div class="card p-4">
            <div class="font-semibold text-xl mb-4">Calendar</div>

            <div class="border-t border-gray-200 my-4"></div>

            <div class="font-semibold text-xm mb-4">Working Day</div>
            <p-table [value]="workingDays" responsiveLayout="scroll" class="mt-4">
                <ng-template pTemplate="header">
                    <tr>
                        <th></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                        <th>Description</th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-day>
                    <tr>
                        <td></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_monday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_tuesday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_wednesday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_thursday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_friday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_saturday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td><p-checkbox [binary]="true" [(ngModel)]="day.is_sunday" (onChange)="onDayToggle(day)"></p-checkbox></td>
                        <td>{{ day.description }}</td>
                    </tr>
                </ng-template>
            </p-table>

            <div class="border-t border-gray-200 my-8"></div>

            <!-- Holiday Code -->
            <div class="font-semibold text-xm mb-4">Holiday</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['CAL', 'add']" label="Add New" icon="pi pi-plus" (click)="addNew()"> </p-button>
                </div>
                <div class="md:w-1/2">
                    <div class="card flex flex-col gap-2">
                        <p-iconfield iconPosition="left">
                            <input pInputText type="text" placeholder="Search" [(ngModel)]="searchText" />
                            <p-inputicon class="pi pi-search" />
                        </p-iconfield>
                    </div>
                </div>
                <div class="card flex flex-col gap-2">
                    <div class="flex flex-wrap gap-2 md:w-1/2 justify-end items-center">
                        <p-button *hasFeaturePermission="['CAL', 'search']" type="button" label="Search" icon="pi pi-search" [loading]="loading[0]" (click)="search()"> </p-button>
                    </div>
                </div>
            </p-fluid>

            <p-table
                [value]="holidayList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} holiday"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:100px">Holiday Date</th>
                        <th style="min-width:200px">Holiday Name</th>
                        <th style="min-width:300px">Description</th>
                        <th style="min-width:100px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-holiday>
                    <tr>
                        <td>{{ holiday.holiday_date }}</td>
                        <td>{{ holiday.holiday_name }}</td>
                        <td>{{ holiday.description }}</td>
                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['CAL', 'view']" icon="pi pi-eye" text raised rounded (click)="view(holiday)"> </p-button>

                                <p-button *hasFeaturePermission="['CAL', 'edit']" icon="pi pi-pencil" severity="info" text raised rounded (click)="edit(holiday)"> </p-button>

                                <p-button *hasFeaturePermission="['CAL', 'deleted']" icon="pi pi-trash" severity="danger" text raised rounded (click)="delete(holiday)"> </p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- View Holiday Dialog -->
            <p-dialog header="View Holiday Details" [(visible)]="displayDetails" [modal]="true" [style]="{ width: '1100px' }" [closable]="true">
                <p-divider></p-divider>
                <div class="flex flex-col md:flex-row">
                    <!-- Labels Column 1 -->
                    <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                        <div><strong>Holiday date:</strong></div>
                        <div><strong>Description:</strong></div>
                    </div>

                    <!-- Values Column 1 -->
                    <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                        <div>{{ selectedHoliday?.holiday_date }}</div>
                        <div>{{ selectedHoliday?.description }}</div>
                    </div>

                    <!-- Labels Column 2 -->
                    <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                        <div><strong>Holiday name:</strong></div>
                    </div>

                    <!-- Values Column 2 -->
                    <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                        <div>{{ selectedHoliday?.holiday_name }}</div>
                    </div>
                </div>
            </p-dialog>

            <p-confirmdialog [style]="{ width: '450px' }" />
        </div>
    `
})
export class CalendarComponent implements OnInit {
    // Working Day
    workingDays: WorkingDayModel[] = [];
    isLoading = false;

    // Holiday
    searchText = '';
    loading = [false];
    holidayList: HolidayModel[] = [];
    selectedHoliday: HolidayModel | null = null;
    displayDetails = false;

    constructor(
        private workingDayService: WorkingDayService,
        private permissionService: FeaturePermissionService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        this.loadWorkingDays();
    }

    // ================================ Working Day ================================
    /** 🔹 Load all working day records */
    loadWorkingDays(): void {
        this.isLoading = true;
        this.workingDayService.GetWorkingDays().subscribe({
            next: (data) => {
                this.workingDays = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('❌ Failed to load working days:', err);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load working day data!'
                });
                this.isLoading = false;
            }
        });
    }

    /** 🔹 Called when any checkbox is toggled */
    onDayToggle(day: WorkingDayModel): void {
        this.workingDayService.updateWorkingDay(day).subscribe({
            next: (res) => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Updated ${day.working_day_name} successfully!`
                });
            },
            error: (err) => {
                console.error('❌ Update failed:', err);
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update working day. Please try again.'
                });
                // Reload to restore original state
                this.loadWorkingDays();
            }
        });
    }

    // ================================ Holiday ================================

    search() {
        this.loading[0] = true;
        // this.branchService.searchBranch(this.searchText).subscribe({
        //     next: (Branch) => {
        //         this.branchList = Branch;
        //         this.loading[0] = false;
        //     },
        //     error: () => {
        //         this.loading[0] = false;
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: 'Search failed.'
        //         });
        //     }
        // });
    }

    addNew() {
        this.router.navigate(['/add-holiday']);
    }

    edit(branch: BranchModel) {
        //this.router.navigate(['/edit-branch'], { state: { branch } });
        console.log(branch);
    }

    view(branch: BranchModel) {
        //this.selectedBranch = branch;
        //this.displayDetails = true;
    }

    delete(branch: BranchModel) {
        // this.confirmationService.confirm({
        //     message: `Are you sure you want to delete role "${branch.branch_name}"?`,
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.branchService.deleteBranch(branch.id!).subscribe({
        //             next: () => {
        //                 this.messageService.add({
        //                     severity: 'success',
        //                     summary: 'Deleted',
        //                     detail: `Role "${branch.branch_name}" deleted successfully.`,
        //                     life: 3000
        //                 });
        //                 // remove from UI list
        //                 this.branchList = this.branchList.filter(r => r.id !== branch.id);
        //             },
        //             error: () => {
        //                 this.messageService.add({
        //                     severity: 'error',
        //                     summary: 'Error',
        //                     detail: 'Failed to delete role.',
        //                     life: 3000
        //                 });
        //             }
        //         });
        //     }
        // });
    }
}
