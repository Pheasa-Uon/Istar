import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../pages/auth/auth.service'; // Make sure this path is correct

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>`
})
export class AppMenu {
    model: MenuItem[] = [];

    //constructor(private http: HttpClient, private router: Router) {}
    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    // ... your other menu items ...
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    { label: 'Reports', icon: 'pi pi-fw pi-chart-bar',
                        items: [
                            { label: 'Operation', icon: 'pi pi-fw pi-cog',
                                items: [
                                    { label: 'Loan', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/formlayout']},
                                    { label: 'Collateral', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/input']},
                                    { label: 'Deposit', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/button']}
                                ]
                            },
                            { label: 'Finance', icon: 'pi pi-fw pi-dollar',
                                items: [
                                    { label: 'Loan', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/formlayout']},
                                    { label: 'Deposit', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/input']},
                                    { label: 'Source of Fund', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/button']},
                                    { label: 'Fixed Assets', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/table']}

                                ]
                            }
                        ]
                    },
                    { label: 'Users Management', icon: 'pi pi-fw pi-users' ,
                        items: [
                            { label: 'Users Profile', icon: 'pi pi-fw pi-user-plus',routerLink: ['/user'] },
                            { label: 'Role Permission', icon: 'pi pi-fw pi-lock',routerLink: ['/rolepermission'] },
                        ]
                    },
                    /*{ label: 'Setting', icon: 'pi pi-fw pi-cog' ,
                        items: [
                            { label: 'Staff Profile', icon: 'pi pi-fw pi-id-card' },
                            { label: 'User Management', icon: 'pi pi-fw pi-users' ,
                                items: [
                                    { label: 'User', icon: 'pi pi-fw pi-user-plus' },
                                    { label: 'Role Permission', icon: 'pi pi-fw pi-lock' },
                                ]
                            }
                        ]
                    }*/
                    {
                        label: 'Quit',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.logout() // ✅ FIXED: use arrow function
                    }
                ]
            },
            // {
            //     label: 'UI Components',
            //     items: [
            //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            //         { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            //         { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            //     ]
            // },
            // {
            //     label: 'Pages',
            //     icon: 'pi pi-fw pi-briefcase',
            //     routerLink: ['/pages'],
            //     items: [
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/landing']
            //         },
            //         {
            //             label: 'Auth',
            //             icon: 'pi pi-fw pi-user',
            //             items: [
            //                 {
            //                     label: 'Login',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/auth/login']
            //                 },
            //                 {
            //                     label: 'Error',
            //                     icon: 'pi pi-fw pi-times-circle',
            //                     routerLink: ['/auth/error']
            //                 },
            //                 {
            //                     label: 'Access Denied',
            //                     icon: 'pi pi-fw pi-lock',
            //                     routerLink: ['/auth/access']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/pages/crud']
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/pages/notfound']
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/pages/empty']
            //         }
            //     ]
            // },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-book',
            //             routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             url: 'https://github.com/primefaces/sakai-ng',
            //             target: '_blank'
            //         }
            //     ]
            // }
        ];
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                // Optional: show notification or do something on success
            },
            error: err => {
                // Optional: handle errors if needed
                console.error('Logout error:', err);
            }
        });
    }

}
