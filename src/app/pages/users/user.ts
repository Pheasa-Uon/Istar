import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabsModule } from 'primeng/tabs';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { Fluid } from 'primeng/fluid';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { User, UserService } from '../service/user.service';


@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbModule,
        TieredMenuModule,
        IconFieldModule,
        InputIconModule,
        MenuModule,
        ButtonModule,
        ContextMenuModule,
        MegaMenuModule,
        PanelMenuModule,
        TabsModule,
        MenubarModule,
        InputTextModule,
        TabsModule,
        StepperModule,
        TabsModule,
        IconField,
        InputIcon,
        Fluid,
        FormsModule,
        TableModule
    ],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">User Profile</div>
            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button label="Add New" icon="pi pi-user-plus" (onClick)="addNewUser()"></p-button>
                </div>
                <div class="md:w-1/2">
                    <div class="card flex flex-col gap-2">
                        <p-iconfield iconPosition="left">
                            <input pInputText type="text" placeholder="Search" />
                            <p-inputicon class="pi pi-search" />
                        </p-iconfield>
                    </div>
                </div>
                <div class="card flex flex-col gap-2">
                    <div class="flex flex-wrap gap-2 md:w-1/2 justify-end items-center">
                        <p-button type="button" label="Search" icon="pi pi-search" [loading]="loading[0]" (click)="load(0)" />
                    </div>
                </div>
            </p-fluid>
            <!-- Table Staff Profile -->

            <p-table [value]="usersList" [scrollable]="true" scrollHeight="400px" styleClass="mt-4">
                <ng-template #header>
                    <tr>
                        <th style="min-width:100px">Id</th>
                        <th style="min-width:200px">UserName</th>
                        <th style="min-width:200px">Name</th>
                        <th style="min-width:200px">Last Login Date</th>
                        <th style="min-width:245px">Email</th>
                        <th style="min-width:200px">Status</th>
                        <th style="min-width:200px">Active</th>
                    </tr>
                </ng-template>
                <ng-template #body let-users>
                    <tr>
                        <td>{{ users.id }}</td>
                        <td>{{ users.username }}</td>
                        <td>{{ users.name }}</td>
                        <td>{{ users.lastlogindate }}</td>
                        <td>{{ users.email }}</td>
                        <td>{{ users.status }}</td>
                        <div class="flex flex-wrap gap-1">
                            <p-button icon="pi pi-eye" text raised rounded />
                            <p-button icon="pi pi-pen-to-square" severity="info" text raised rounded />
                            <p-button icon="pi pi-trash" severity="danger" text raised rounded />
                        </div>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class Users {

    usersList: User[] = [];

    loading = [false, false, false, false];

    constructor(
        private UserService: UserService,
        private router: Router,
    ) {}

    ngOnInit() {
        //this.UserService.getUserInfo().then(users => {this.usersList = users;});
        this.UserService.getUsersMedium().then((users) => (this.usersList = users));
    }
    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => (this.loading[index] = false), 1000);
    }

    addNewUser() {
        this.router.navigate(['/adduser']);
    }

}
