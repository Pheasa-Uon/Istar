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

import { ToggleSwitch } from 'primeng/toggleswitch';
import { DepartmentModel } from '../../../model/administrator/systemAdmin/department.model';
import { DepartmentService } from '../../../service/administrator/systemAdmin/department.service';

@Component({
    selector: 'app-edit-department',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Textarea, ButtonGroup, MessagesComponent, HasPermissionDirective],
    template: `
        <app-messages></app-messages>

        <form #Form="ngForm" (ngSubmit)="save()" novalidate>

            <div class="p-fluid">
                <div class="card flex flex-col gap-6 w-full p-4">
                    <div class="font-semibold text-xl">Add New Department</div>

                    <div class="border-t border-gray-200 my-4"></div>

                    <!-- Department Code & Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="departmentCode">Department Code</label>
                            <input
                                pInputText
                                id="departmentCode"
                                name="departmentCode"
                                type="text"
                                placeholder="Department code"
                                [readonly]="true"
                                [(ngModel)]="department.department_code"
                                maxlength="4"
                                class="w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="departmentName">
                                Department Name <span class="text-red-500">*</span>
                            </label>
                            <input
                                pInputText
                                id="departmentName"
                                name="departmentName"
                                type="text"
                                placeholder="Department name"
                                [(ngModel)]="department.department_name"
                                required
                                class="w-full"
                                [ngClass]="{ 'p-invalid': submitted && !department.department_name }"
                            />
                            <small
                                *ngIf="submitted && !department.department_name"
                                class="text-red-500"
                            >Department name is required.</small
                            >
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="flex flex-col gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea
                            pTextarea
                            id="description"
                            name="description"
                            rows="4"
                            [(ngModel)]="department.description"
                            class="w-full"
                        ></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['DEP', 'save']" type="submit" label="Save" icon="pi pi-check" [disabled]="Form.invalid" />
                            <p-button *hasFeaturePermission="['DEP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </div>
        </form>
    `,
})
export class EditDepartment implements OnInit {
    submitted = false;

    department: DepartmentModel = {
        id: undefined,
        department_code: '',
        department_name: '',
        description: '',
    };


    constructor(
        private router: Router,
        private departmentService: DepartmentService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['department']) {
            this.department = { ...navigation.extras.state['department'] };
        }

        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {

    }

    goBack() {
        this.router.navigate(['/department']);
    }

    save() {
        this.submitted = true;

        if (!this.department.department_name) {
            this.messageService.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Department name is required.',
            });
            return;
        }

        this.departmentService.updateDepartment(this.department).subscribe({
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
