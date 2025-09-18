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
    GlobalSystemParameter,
    GlobalSystemParameterService
} from '../../../service/administrator/system/global.system.parameter.service';
import {
    DropdownItemModuleName,
    GspDropdownItemService,
    DropdownItemFieldName
} from '../../../service/administrator/system/gsp.dropdown.item.service';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';

@Component({
    selector: 'app-add-global-system-parameter',
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
        <form #gspForm="ngForm" (ngSubmit)="saveGlobalSystemParameter()" novalidate>
            <div class="fixed top-3/1 right-4 z-50 w-[500px]">
                <app-messages></app-messages>
            </div>

            <p-fluid>
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Add New Global System Parameter</div>

                    <!-- Module & Field Dropdowns -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="moduleName">Module Name <span class="text-red-500">*</span></label>
                            <p-select
                                id="moduleName" name="moduleName"
                                [(ngModel)]="globalSystemParameter.moduleName"
                                [options]="dropdownModuleNameItems"
                                optionLabel="name" optionValue="code"
                                placeholder="Select One" class="w-full"
                                (onChange)="onModuleChange($event)"
                                [ngClass]="{ 'p-invalid': submitted && !globalSystemParameter.moduleName }"
                                required>
                            </p-select>
                            <small *ngIf="submitted && !globalSystemParameter.moduleName" class="text-red-500">Module Name is required.</small>
                        </div>

                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="fieldName">Field Name <span class="text-red-500">*</span></label>
                            <p-select
                                id="fieldName" name="fieldName"
                                [(ngModel)]="globalSystemParameter.fieldName"
                                [options]="dropdownFieldItems"
                                optionLabel="name" optionValue="code"
                                placeholder="Select One" class="w-full"
                                [ngClass]="{ 'p-invalid': submitted && !globalSystemParameter.fieldName }"
                                required>
                            </p-select>
                            <small *ngIf="submitted && !globalSystemParameter.fieldName" class="text-red-500">Field Name is required.</small>
                        </div>
                    </div>

                    <!-- Sys Par Code & Value Name -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="sysParCode">Sys par code <span class="text-red-500">*</span></label>
                            <input pInputText id="sysParCode" name="sysParCode" type="text" placeholder="Sys par code"
                                   [(ngModel)]="globalSystemParameter.sysParCode" maxlength="15"
                                   required class="w-full"
                                   [ngClass]="{ 'p-invalid': submitted && !globalSystemParameter.sysParCode }" />
                            <small *ngIf="submitted && !globalSystemParameter.sysParCode" class="text-red-500">Sys par code is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="valueName">Value Name <span class="text-red-500">*</span></label>
                            <input pInputText id="valueName" name="valueName" type="text" placeholder="Value Name"
                                   [(ngModel)]="globalSystemParameter.valueName" required class="w-full"
                                   [ngClass]="{ 'p-invalid': submitted && !globalSystemParameter.valueName }" />
                            <small *ngIf="submitted && !globalSystemParameter.valueName" class="text-red-500">Value Name is required.</small>
                        </div>
                    </div>

                    <!-- Local Value & Display Order -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="localValueName">Local Value Name <span class="text-red-500">*</span></label>
                            <input pInputText id="localValueName" name="localValueName" type="text" placeholder="Local value name"
                                   [(ngModel)]="globalSystemParameter.localValueName" required class="w-full"
                                   [ngClass]="{ 'p-invalid': submitted && !globalSystemParameter.localValueName }" />
                            <small *ngIf="submitted && !globalSystemParameter.localValueName" class="text-red-500">Local value name is required.</small>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="displayOrder">Order <span class="text-red-500">*</span></label>
                            <input pInputText id="displayOrder" name="displayOrder" type="number" placeholder="Order"
                                   [(ngModel)]="globalSystemParameter.displayOrder" required class="w-full"
                                   [ngClass]="{ 'p-invalid': submitted && (globalSystemParameter.displayOrder === null || globalSystemParameter.displayOrder === undefined) }" />
                            <small *ngIf="submitted && (globalSystemParameter.displayOrder === null || globalSystemParameter.displayOrder === undefined)" class="text-red-500">
                                Order is required.
                            </small>
                        </div>
                    </div>

                    <!-- Status & Description -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="status">Status</label>
                            <p-select id="status" name="status"
                                      [(ngModel)]="globalSystemParameter.sysParStatus"
                                      [options]="dropdownStatusItems"
                                      optionLabel="name" optionValue="code"
                                      placeholder="Select One" class="w-full"></p-select>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">

                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="description">Description</label>
                        <textarea pTextarea id="description" name="description" rows="4"
                                  [(ngModel)]="globalSystemParameter.description" class="w-full"></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="card flex flex-wrap gap-0 w-full justify-end">
                        <p-buttongroup>
                            <p-button *hasFeaturePermission="['GSP','save']" type="submit" label="Save" icon="pi pi-check"
                                      [disabled]="gspForm.invalid"></p-button>
                            <p-button *hasFeaturePermission="['GSP','cancel']" label="Cancel" icon="pi pi-times"
                                      (click)="goBack()"></p-button>
                        </p-buttongroup>
                    </div>
                </div>
            </p-fluid>
        </form>
    `
})
export class AddGlobalSystemParameter implements OnInit {
    submitted = false; // Added submitted flag like in AddUser
    globalSystemParameter: GlobalSystemParameter = {
        id: undefined,
        sysParCode: '',
        moduleName: '',
        fieldName: '',
        valueName: '',
        localValueName: '',
        displayOrder: undefined,
        sysParStatus: 'A',
        description: ''
    };

    dropdownModuleNameItems: DropdownItemModuleName[] = [];
    dropdownFieldItems: DropdownItemFieldName[] = [];
    dropdownStatusItems = [
        { name: 'Active', code: 'A' },
        //{ name: 'Blocked', code: 'B' },
        { name: 'Closed', code: 'C' }
    ];

    constructor(
        private router: Router,
        private globalSystemParameterService: GlobalSystemParameterService,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService,
        private moduleService: GspDropdownItemService
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

    onModuleChange(event: any) {
        const selectedModule = event.value;
        if (selectedModule) {
            this.moduleService.getModuleFields(selectedModule).subscribe({
                next: (data) => this.dropdownFieldItems = data,
                error: (err) => console.error('Error loading module fields', err)
            });
        } else {
            this.dropdownFieldItems = [];
        }
        console.log("Module changed to: " + selectedModule + "");
    }

    goBack() {
        this.router.navigate(['/global-system-parameter']);
    }

    saveGlobalSystemParameter() {
        this.submitted = true; // Set submitted flag like in AddUser

        // Validate required fields before proceeding
        if (!this.globalSystemParameter.moduleName ||
            !this.globalSystemParameter.fieldName ||
            !this.globalSystemParameter.sysParCode ||
            !this.globalSystemParameter.valueName ||
            !this.globalSystemParameter.localValueName ||
            this.globalSystemParameter.displayOrder === null ||
            this.globalSystemParameter.displayOrder === undefined) {
            return; // don't proceed if required fields are missing
        }

        this.globalSystemParameterService.addGlobalSystemParameter(this.globalSystemParameter).subscribe({
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
