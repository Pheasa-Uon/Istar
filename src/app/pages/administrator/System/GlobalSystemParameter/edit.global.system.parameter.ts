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
import { MessagesComponent } from '../../../message/message'; // adjust path if needed
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import {
    GlobalSystemParameterService
} from '../../../service/administrator/system/global.system.parameter.service';
import {
    DropdownItemFieldName,
    DropdownItemModuleName, GspDropdownItemService
} from '../../../service/administrator/system/gsp.dropdown.item.service';
import { GlobalSystemParameter } from '../../../model/administrator/system/global.system.parameter.model';

@Component({
    selector: 'app-edit-global-System-parameter',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup, MessagesComponent, HasPermissionDirective],
    template: `

        <app-messages></app-messages>


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
                            [(ngModel)]="globalSystemParameter.module_name"
                            [options]="dropdownModuleNameItems"
                            optionLabel="name" optionValue="code"
                            placeholder="Select One" class="w-full"
                            [readonly]="true"
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
                            [(ngModel)]="globalSystemParameter.field_name"
                            [options]="dropdownFieldItems"
                            optionLabel="name" optionValue="code"
                            [readonly]="true"
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
                        <input pInputText id="sysParCode" name="sysParCode" type="text" placeholder="Sys par code" [(ngModel)]="globalSystemParameter.sys_par_code"  maxlength="15" /> <!-- 👈 limit to 15 characters -->
                        <!--
                         <small *ngIf="gspForm.submitted && !globalSystemParameter.sysParCode" class="text-red-500">Sys par code is required.</small>
                        -->
                     </div>
                     <div class="flex flex-wrap gap-2 w-full">
                         <label for="valueName">Value Name <span class="text-red-500">*</span></label>
                         <input pInputText id="valueName" name="valueName" type="text" placeholder="Value Name" [(ngModel)]="globalSystemParameter.value_name" />
                         <!--
                         <small *ngIf="gspForm.submitted && !globalSystemParameter.valueName" class="text-red-500">Value Name is required.</small>
                         -->
                    </div>
                </div>

                <!-- Local Value & Display Order -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="localValueName">Local Value Name <span class="text-red-500">*</span></label>
                        <input pInputText id="localValueName" name="localValueName" type="text" placeholder="Local value name" [(ngModel)]="globalSystemParameter.local_value_name" />
                        <!--
                        <small *ngIf="gspForm.submitted && !globalSystemParameter.localValueName" class="text-red-500">Local value name is required.</small>
                        -->
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="displayOrder">Order <span class="text-red-500">*</span></label>
                        <input pInputText id="displayOrder" name="displayOrder" type="number" placeholder="Order" [(ngModel)]="globalSystemParameter.display_order" />
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
                        <p-select id="status" name="status" [(ngModel)]="globalSystemParameter.sys_par_status" [options]="dropdownStatusItems" optionLabel="name" optionValue="code" placeholder="Select One" class="w-full"></p-select>
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
                        <p-button *hasFeaturePermission="['GSP', 'save']" label="Save" icon="pi pi-check" (click)="saveGlobalSystemParameter()" />
                        <p-button *hasFeaturePermission="['GSP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class EditGlobalSystemParameter {
    globalSystemParameter: GlobalSystemParameter = {
        id: undefined,
        sys_par_code: '',
        module_name: undefined,
        field_name: undefined,
        value_name: '',
        local_value_name: '',
        display_order: undefined,
        sys_par_status: undefined,
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
        if (navigation?.extras.state?.['globalSystemParameter']) {
            const gsp = navigation.extras.state['globalSystemParameter'];

            this.globalSystemParameter = {
                ...this.globalSystemParameter,
                id: gsp.id,
                sys_par_code: gsp.sys_par_code ?? '',
                module_name: gsp.module_name?.value ?? null,  // assign code
                field_name: gsp.field_name?.value ?? null,    // assign code
                value_name: gsp.value_name ?? '',
                local_value_name: gsp.local_value_name ?? '',
                display_order: gsp.display_order ?? undefined,
                sys_par_status: gsp.sys_par_status?.value ?? null,
                description: gsp.description ?? ''
            };
        }

        this.permissionService.loadPermissions();
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
                if (this.globalSystemParameter.module_name) {
                    this.loadFieldsForModule('');
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
                if (this.globalSystemParameter.field_name?.value) {
                    const exists = data.find(f => f.code === this.globalSystemParameter.field_name?.value);
                    if (!exists) {
                        this.globalSystemParameter.field_name = undefined; // or handle invalid field
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
            this.globalSystemParameter.field_name = undefined;
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
