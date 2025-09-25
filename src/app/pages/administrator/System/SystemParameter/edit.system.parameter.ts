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
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersmanagement/userpermissions/feature.permission.service';
import {
    GlobalSystemParameterService
} from '../../../service/administrator/system/global.system.parameter.service';
import {
    DropdownItemFieldName,
    DropdownItemModuleName, GspDropdownItemService
} from '../../../service/administrator/system/gsp.dropdown.item.service';
import { SystemParameterModel } from '../../../model/administrator/system/system.parameter.model';
import { SystemParameterService } from '../../../service/administrator/system/system.parameter.service';
import { SPDropdownItemService } from '../../../service/administrator/system/system.parameter.dropdown.item.service';

@Component({
    selector: 'app-edit-System-parameter',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup, Message, HasPermissionDirective],
    template: `
        <div class="fixed top-3/1 right-4 z-50 w-[300px] md:w-1/3">
            <app-messages></app-messages>
        </div>

        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Edit System Parameter</div>
                <div class="border-t border-gray-200 my-4"></div>

                <!-- Module & Field Dropdowns -->
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="parameterModule">Parameter Module <span class="text-red-500">*</span></label>
                        <p-select
                            id="parameterModule" name="parameterModule"
                            [(ngModel)]="systemParameter.parameterModule"
                            [options]="dropdownModuleNameItems"
                            optionLabel="name" optionValue="code"
                            placeholder="Select One" class="w-full"
                        >
                        </p-select>
                        <!--
                        <small *ngIf="gspForm.submitted && !globalSystemParameter.moduleName" class="text-red-500">Module Name is required.</small>
                        -->
                    </div>

                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="parameterName">Parameter Name <span class="text-red-500">*</span></label>
                        <input pInputText id="parameterName" name="parameterName" type="text" placeholder="Parameter Name" [(ngModel)]="systemParameter.parameterName"/> <!-- 👈 limit to 15 characters -->
                        <!--
                         <small *ngIf="gspForm.submitted && !globalSystemParameter.sysParCode" class="text-red-500">Sys par code is required.</small>
                        -->
                    </div>
                </div>

                <!-- Sys Par Code & Value Name -->
                <div class="flex flex-col md:flex-row gap-6">
                     <div class="flex flex-wrap gap-2 w-full">
                         <label for="parameterValue">Parameter Value <span class="text-red-500">*</span></label>
                         <input pInputText id="parameterValue" name="parameterValue" type="text" placeholder="Parameter Value" [(ngModel)]="systemParameter.parameterValue" />
                         <!--
                         <small *ngIf="gspForm.submitted && !globalSystemParameter.valueName" class="text-red-500">Value Name is required.</small>
                         -->
                    </div>
                    <div class="flex flex-wrap gap-2 w-full"></div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" name="description" rows="4" [(ngModel)]="systemParameter.description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button *hasFeaturePermission="['SYP', 'save']" label="Save" icon="pi pi-check" (click)="saveSystemParameter()" />
                        <p-button *hasFeaturePermission="['SYP', 'cancel']" label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class EditSystemParameter {
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
        private messageService: MessageService,
        private permissionService: FeaturePermissionService,
        private systemParameterService: SystemParameterService,
        private moduleService: SPDropdownItemService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['sp']) {
            this.systemParameter = { ...navigation.extras.state['sp'] };
        }
        this.permissionService.loadPerminsions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        // Load Module Names
        this.moduleService.getDropDownModuleNames().subscribe({
            next: (data) => {
                this.dropdownModuleNameItems = data;
            },
            error: (err) => console.error('Error loading module names', err)
        });
    }

    goBack() {
        this.router.navigate(['/system-parameter']);
    }

    saveSystemParameter() {
        this.systemParameterService.updateSystemParameter(this.systemParameter).subscribe({
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
