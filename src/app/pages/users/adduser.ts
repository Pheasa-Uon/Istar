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

@Component({
    selector: 'app-add-user',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, Select, Textarea, Fluid, ButtonGroup],
    template: `
        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Add New User Profile</div>
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="userid">User Id</label>
                        <input pInputText id="userid" type="text" placeholder="Auto" [disabled]="true" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name">Name</label>
                        <input pInputText id="name" type="text" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="username">Username</label>
                        <input pInputText id="username" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="password">Password</label>
                        <div class="flex w-full items-center gap-2">
                            <input pInputText id="password" [type]="showPassword ? 'text' : 'password'" class="flex-1" />
                            <button type="button" pButton icon="{{ showPassword ? 'pi pi-eye-slash' : 'pi pi-eye' }}" (click)="showPassword = !showPassword" class="p-button-sm"></button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="email">Email</label>
                        <input pInputText id="email" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select id="status" [(ngModel)]="dropdownItem" [options]="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></p-select>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" rows="4"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button label="Save" icon="pi pi-check" />
                        <p-button label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class AddUser {
    constructor(private router: Router) {}

    goBack() {
        this.router.navigate(['/user']);
    }

    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Block', code: 'B' },
        { name: 'Close', code: 'C' }
    ];

    dropdownItem = this.dropdownItems[0];

    showPassword = false;
}

