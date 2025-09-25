import { Component, OnInit } from '@angular/core';
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
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import {
    GlobalSystemParameterService
} from '../../../service/administrator/system/global.system.parameter.service';
import {
    DropdownItemModuleName
} from '../../../service/administrator/system/gsp.dropdown.item.service';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import { SystemParameterService } from '../../../service/administrator/system/system.parameter.service';
import { SPDropdownItemService } from '../../../service/administrator/system/system.parameter.dropdown.item.service';
import { SystemParameterModel } from '../../../model/administrator/system/system.parameter.model';

@Component({
    selector: 'app-add-System-parameter',
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
        <form #gspForm="ngForm" (ngSubmit)="saveSystemParameter()" novalidate>
            <div class="fixed top-3/1 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Add New System Parameter</div>
                    <div class="border-t border-gray-200 my-4"></div>

                    <!-- Module & Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="parameterModule">Parameter Module <span class="text-red-500">*</span></label>
                            <p-select
                                id="parameterModule" name="parameterModule"
                                [(ngModel)]="systemParameter.parameterModule"
                                [options]="dropdownModuleNameItems"
                                optionLabel="name" optionValue="code"
                                placeholder="Select One" class="w-full"
                                [ngClass]="{ 'p-invalid': submitted && !systemParameter.parameterModule }"
                                required>
                            </p-select>
                            <small *ngIf="submitted && !systemParameter.parameterModule" class="text-red-500">Parameter Module is required.</small>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="parameterName">Parameter Name <span class="text-red-500">*</span></label>
                            <input pInputText id="parameterName" name="parameterName" type="text" placeholder="Parameter Name"
                                   [(ngModel)]="systemParameter.parameterName" maxlength="15"
                                   required class="w-full"
                                   [ngClass]="{ 'p-invalid': submitted && !systemParameter.parameterName }" />
                            <small *ngIf="submitted && !systemParameter.parameterName" class="text-red-500">Parameter Name is required.</small>
                        </div>
                    </div>


                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="parameterValue">Parameter Value <span class="text-red-500">*</span></label>
                            <input pInputText id="parameterValue" name="parameterValue" type="text" placeholder="Parameter Value"
                                   [(ngModel)]="systemParameter.parameterValue" maxlength="15"
                                   required class="w-full"
                                   [ngClass]="{ 'p-invalid': submitted && !systemParameter.parameterValue }" />
                            <small *ngIf="submitted && !systemParameter.parameterValue" class="text-red-500">Sys par code is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full"></div>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4"
                                  [(ngModel)]="systemParameter.description" class="w-full"></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['SYP','save']" type="submit" label="Create New" icon="pi pi-plus-circle"
                                      [disabled]="gspForm.invalid"></p-button>
                            <p-button *hasFeaturePermission="['SYP','cancel']" label="Cancel" icon="pi pi-times"
                                      (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </p-fluid>
        </form>
    `
})
export class AddSystemParameter implements OnInit {
    submitted = false; // Added submitted flag like in AddUser
    systemParameter: SystemParameterModel = {
        id: undefined,
        parameterModule: '',
        parameterName: '',
        parameterValue: '',
        description: ''
    };

    dropdownModuleNameItems: DropdownItemModuleName[] = [];

    constructor(
        private router: Router,
        private systemParameterService: SystemParameterService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService,
        private moduleService: SPDropdownItemService
    ) {
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        // Load Module Names
        this.moduleService.getDropDownModuleNames().subscribe({
            next: (data) => this.dropdownModuleNameItems = data,
            error: (err) => console.error('Error loading module names', err)
        });
    }

    goBack() {
        this.router.navigate(['/system-parameter']);
    }

    saveSystemParameter() {
        this.submitted = true; // Set submitted flag like in AddUser

        // Validate required fields before proceeding
        if (!this.systemParameter.parameterModule ||
            !this.systemParameter.parameterName ||
            !this.systemParameter.parameterValue
        ) {
            return; // don't proceed if required fields are missing
        }

        this.systemParameterService.addSystemParameter(this.systemParameter).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Global System Parameter created successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Global System Parameter creation failed.'
                });
            }
        });
    }
}
