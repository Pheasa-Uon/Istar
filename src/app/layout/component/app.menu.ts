import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../pages/authentication/auth.service';
import { MenuPermissionDTO, MenuService } from '../service/menu.service';

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
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    constructor(
        private http: HttpClient,
        private router: Router,
        private menuService: MenuService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.menuService.getMyMenuPermissions().subscribe(menus => {
            // Map the API menus to PrimeNG menu items
            const dynamicMenuItems = menus
                .filter(m => m.visible)
                .map(m => this.mapToMenuItem(m));

            // Add the static "Quit" menu item
            const AboutMenuItem: MenuItem = {
                label: 'About',
                icon: 'pi pi-fw pi-question-circle',
                routerLink: ['/']
            };
            const quitMenuItem: MenuItem = {
                label: 'Quit',
                icon: 'pi pi-fw pi-sign-out',
                command: () => this.logout()
            };

            dynamicMenuItems.push(AboutMenuItem,quitMenuItem);

            // Create the main menu structure that matches the old format
            this.model = [
                {
                    label: 'Home',
                    items: dynamicMenuItems
                },
                // Keep other sections from old code if needed
                {
                    label: 'UI Components',
                    items: [
                        { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                        { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                        { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                        { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                        { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                        { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                        { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                        { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                        { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                        { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                        { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                        { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                        { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                        { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                        { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                    ]
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/pages'],
                    items: [
                        {
                            label: 'Landing',
                            icon: 'pi pi-fw pi-globe',
                            routerLink: ['/landing']
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Login',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/authentication/login']
                                },
                                {
                                    label: 'Error',
                                    icon: 'pi pi-fw pi-times-circle',
                                    routerLink: ['/authentication/error']
                                },
                                {
                                    label: 'Access Denied',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/authentication/access']
                                }
                            ]
                        },
                        {
                            label: 'Crud',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: ['/pages/crud']
                        },
                        {
                            label: 'Not Found',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            routerLink: ['/pages/notfound']
                        },
                        {
                            label: 'Empty',
                            icon: 'pi pi-fw pi-circle-off',
                            routerLink: ['/pages/empty']
                        }
                    ]
                }
            ];
        });
    }

    private mapToMenuItem(menu: MenuPermissionDTO): MenuItem {
        return {
            label: menu.label,
            icon: menu.icon,
            routerLink: menu.route && menu.route !== '/' ? [menu.route] : undefined,
            items: menu.children && menu.children.length > 0
                ? menu.children.filter(c => c.visible).map(c => this.mapToMenuItem(c))
                : undefined
        };
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                // Optional: show notification or do something on success
            },
            error: err => {
                console.error('Logout error:', err);
            }
        });
    }
}
