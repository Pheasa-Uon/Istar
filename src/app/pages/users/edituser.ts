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
import { UserService, User } from '../service/user.service';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        Select,
        Textarea,
        Fluid,
        ButtonGroup
    ],
    template: `
        <p-fluid>
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Edit User Profile</div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="userid">User Id</label>
                        <input pInputText id="userid" type="text" [(ngModel)]="user.id" [disabled]="true" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="name">Name</label>
                        <input pInputText id="name" type="text" [(ngModel)]="user.name" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="username">Username</label>
                        <input pInputText id="username" type="text" [(ngModel)]="user.username" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="password">Password</label>
                        <div class="flex w-full items-center gap-2">
                            <input pInputText id="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="user.password" class="flex-1" />
                            <button type="button" pButton icon="{{ showPassword ? 'pi pi-eye-slash' : 'pi pi-eye' }}" (click)="showPassword = !showPassword" class="p-button-sm"></button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="email">Email</label>
                        <input pInputText id="email" type="text" [(ngModel)]="user.email" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="status">Status</label>
                        <p-select
                            id="status"
                            [(ngModel)]="user.status"
                            [options]="dropdownItems"
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select One"
                            class="w-full"
                        ></p-select>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 w-full">
                    <label for="description">Description</label>
                    <textarea pTextarea id="description" rows="4" [(ngModel)]="user.description"></textarea>
                </div>

                <div class="card flex flex-wrap gap-0 w-full justify-end">
                    <p-buttongroup>
                        <p-button label="Save" icon="pi pi-check" (click)="saveUser()" />
                        <p-button label="Cancel" icon="pi pi-times" (click)="goBack()"></p-button>
                    </p-buttongroup>
                </div>
            </div>
        </p-fluid>
    `
})
export class EditUser {
    user: User = {
        id: undefined,
        username: '',
        name: '',
        password: '',
        email: '',
        status: '',
        description: ''
    };

    dropdownItems = [
        { name: 'Active', code: 'A' },
        { name: 'Block', code: 'B' },
        { name: 'Close', code: 'C' }
    ];

    showPassword = false;

    constructor(private router: Router, private userService: UserService) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['user']) {
            this.user = { ...navigation.extras.state['user'] };
        }
    }

    goBack() {
        this.router.navigate(['/user']);
    }

    saveUser() {
        this.userService.updateUser(this.user).subscribe({
            next: () => {
                alert('User updated successfully!');
                this.goBack();
            },
            error: (err) => {
                //console.error('Update failed', err);
                alert('Update failed');
            }
        });
    }
}
