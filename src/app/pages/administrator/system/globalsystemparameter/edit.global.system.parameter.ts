import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fluid } from 'primeng/fluid';
import { ButtonGroup } from 'primeng/buttongroup';
import { MessageService } from '../../../message/message.service';
import { Message } from '../../../message/message'; // adjust path if needed
import { RolePermissionService, RolePermission } from '../../../service/administrator/usersmanagement/rolepermissions/role.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import {
    GlobalSystemParameter,
    GlobalSystemParameterService
} from '../../../service/administrator/system/global.system.parameter.service';
import {
    DropdownItemFieldName,
    DropdownItemModuleName, GspDropdownItemService
} from '../../../service/administrator/system/gsp.dropdown.item.service';

@Component({
    selector: 'app-edit-global-system-parameter',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup, Message, HasPermissionDirective],
    template: `
        <div class="fixed top-3/1 right-4 z-50 w-[300px] md:w-1/3">
            <app-messages></app-messages>
        </div>

        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Edit Role Permission</div>
                <div class="border-t border-gray-200 my-4"></div>

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
                            (onChange)="onModuleChange($event)">
                        </p-select>
                        <!--
                        <small *ngIf="gspForm.submitted && !globalSystemParameter.moduleName" class="text-red-500">Module Name is required.</small>
                        -->
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="fieldName">Field Name <span class="text-red-500">*</span></label>
                        <p-select
                            id="fieldName" name="fieldName"
                            [(ngModel)]="globalSystemParameter.fieldName"
                            [options]="dropdownFieldItems"
                            optionLabel="name" optionValue="code"
                            placeholder="Select One" class="w-full">
                        </p-select>
                        <!--
                        <small *ngIf="gspForm.submitted && !globalSystemParameter.fieldName" class="text-red-500">Field Name is required.</small>
                        -->
                    </div>
                </div>

                <!-- Sys Par Code & Value Name -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="sysParCode">Sys par code <span class="text-red-500">*</span></label>
                        <input pInputText id="sysParCode" name="sysParCode" type="text" placeholder="Sys par code" [(ngModel)]="globalSystemParameter.sysParCode"  maxlength="15" /> <!-- 👈 limit to 15 characters -->
                        <!--
                         <small *ngIf="gspForm.submitted && !globalSystemParameter.sysParCode" class="text-red-500">Sys par code is required.</small>
                        -->
                     </div>
                     <div class="flex flex-wrap gap-2 w-full">
                         <label for="valueName">Value Name <span class="text-red-500">*</span></label>
                         <input pInputText id="valueName" name="valueName" type="text" placeholder="Value Name" [(ngModel)]="globalSystemParameter.valueName" />
                         <!--
                         <small *ngIf="gspForm.submitted && !globalSystemParameter.valueName" class="text-red-500">Value Name is required.</small>
                         -->
                    </div>
                </div>

                <!-- Local Value & Display Order -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="localValueName">Local Value Name <span class="text-red-500">*</span></label>
                        <input pInputText id="localValueName" name="localValueName" type="text" placeholder="Local value name" [(ngModel)]="globalSystemParameter.localValueName" />
                        <!--
                        <small *ngIf="gspForm.submitted && !globalSystemParameter.localValueName" class="text-red-500">Local value name is required.</small>
                        -->
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="displayOrder">Order <span class="text-red-500">*</span></label>
                        <input pInputText id="displayOrder" name="displayOrder" type="number" placeholder="Order" [(ngModel)]="globalSystemParameter.displayOrder" />
<!--
                        <small *ngIf="gspForm.submitted && (globalSystemParameter.displayOrder === null || globalSystemParameter.displayOrder === undefined)" class="text-red-500">
                            Order is required.
                        </small>
-->
                    </div>
                </div>

                <!-- Status & Description -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select id="status" name="status" [(ngModel)]="globalSystemParameter.sysParStatus" [options]="dropdownStatusItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">

                    </div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="globalSystemParameter.description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['RLP', 'save']" label="Save" icon="pi pi-check" (click)="saveGlobalSystemParameter()" />
                        <p-button *hasFeaturePermission="['RLP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class EditGlobalSystemParameter {
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
        //{ name: 'Closed', code: 'C' },
        { name: 'Inactive', code: 'I' }
    ];

    constructor(
        private router: Router,
        private messageService: MessageService,
        private permissionService: FeaturePermissionService,
        private globalSystemParameterService: GlobalSystemParameterService,
        private moduleService: GspDropdownItemService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['gsp']) {
            this.globalSystemParameter = { ...navigation.extras.state['gsp'] };
        };
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    // ngOnInit(): void {
    //     // Load Module Names
    //     this.moduleService.getDropDownModuleNames().subscribe({
    //         next: (data) => this.dropdownModuleNameItems = data,
    //         error: (err) => console.error('Error loading module names', err)
    //     });
    // }

    ngOnInit(): void {
        // Load Module Names
        this.moduleService.getDropDownModuleNames().subscribe({
            next: (data) => {
                this.dropdownModuleNameItems = data;

                // If editing, load fields for the already selected module
                if (this.globalSystemParameter.moduleName) {
                    this.loadFieldsForModule(this.globalSystemParameter.moduleName);
                }
            },
            error: (err) => console.error('Error loading module names', err)
        });
    }

    loadFieldsForModule(moduleCode: string) {
        this.moduleService.getModuleFields(moduleCode).subscribe({
            next: (data) => {
                this.dropdownFieldItems = data;

                // Optional: keep the previously selected field value
                if (this.globalSystemParameter.fieldName) {
                    const exists = data.find(f => f.code === this.globalSystemParameter.fieldName);
                    if (!exists) {
                        this.globalSystemParameter.fieldName = undefined; // or handle invalid field
                    }
                }
            },
            error: (err) => console.error('Error loading module fields', err)
        });
    }

    onModuleChange(event: any) {
        const selectedModule = event.value;
        if (selectedModule) {
            this.loadFieldsForModule(selectedModule);
        } else {
            this.dropdownFieldItems = [];
            this.globalSystemParameter.fieldName = undefined;
        }
    }


    goBack() {
        this.router.navigate(['/global-system-parameter']);
    }

    saveGlobalSystemParameter() {
        this.globalSystemParameterService.updateGlobalSystemParameter(this.globalSystemParameter).subscribe({
            next: () => {
                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Role Permission updated successfully!'
                });
                setTimeout(() => this.goBack(), 1000);
            },
            error: () => {
                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Role Permission update failed.'
                });
            }
        });
    }
}
