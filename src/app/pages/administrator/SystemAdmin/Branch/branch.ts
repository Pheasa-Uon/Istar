import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { Fluid } from 'primeng/fluid';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { BranchService } from '../../../service/administrator/systemAdmin/branch.service';
import { BranchModel } from '../../../model/administrator/systemAdmin/branch.model';

@Component({
    selector: 'app-branch',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        DialogModule,
        Fluid,
        DividerModule,
        TreeTableModule,
        CheckboxModule,
        HasPermissionDirective,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="font-semibold text-xl mb-4">Branch</div>

            <p-fluid class="flex flex-col md:flex-row gap-2 justify-end items-center">
                <div class="flex flex-wrap gap-2 md:w-1/2">
                    <p-button *hasFeaturePermission="['BRN','add']"
                              label="Add New"
                              icon="pi pi-plus"
                              (click)="addNew()">
                    </p-button>
                </div>
                <div class="md:w-1/2">
                    <div class="card flex flex-col gap-2">
                        <p-iconfield iconPosition="left">
                            <input pInputText type="text" placeholder="Search" [(ngModel)]="searchText" />
                            <p-inputicon class="pi pi-search" />
                        </p-iconfield>
                    </div>
                </div>
                <div class="card flex flex-col gap-2">
                    <div class="flex flex-wrap gap-2 md:w-1/2 justify-end items-center">
                        <p-button *hasFeaturePermission="['BRN','search']"
                                  type="button"
                                  label="Search"
                                  icon="pi pi-search"
                                  [loading]="loading[0]"
                                  (click)="search()">
                        </p-button>
                    </div>
                </div>
            </p-fluid>

            <!--
             <p-table
                [value]="roleList" [scrollable]="true" scrollHeight="475px" class="mt-4"
             >
             -->
            <p-table
                [value]="branchList"
                [rows]="5"
                [paginator]="true"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} branch"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[5, 10, 15, 20, 25, 30]"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th style="min-width:150px">Branch Code</th>
                        <th style="min-width:150px">Branch Name</th>
                        <th style="min-width:250px">Branch Prefix</th>
                        <th style="min-width:200px">City/Province</th>
                        <th style="min-width:150px">Phone</th>
                        <th style="min-width:100px">Online</th>
                        <th style="min-width:200px">Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-branch>
                    <tr>
                        <td>{{ branch.branch_code }}</td>
                        <td>{{ branch.branch_name }}</td>
                        <td>{{ branch.branch_prefix }}</td>
                        <td>{{ branch.province?.label }}</td>
                        <td>{{ branch.phone }}</td>
                        <td
                            [ngStyle]="{
                                'color': branch.online_status?.value === true ? 'Green' :
                                         branch.online_status?.value === false ? 'Gray' : 'black'
                        }">
                            {{ branch.online_status?.label }}
                        </td>

                        <td>
                            <div class="flex flex-wrap gap-1">
                                <p-button *hasFeaturePermission="['BRN','view']"
                                          icon="pi pi-eye"
                                          text
                                          raised
                                          rounded
                                          (click)="view(branch)">
                                </p-button>

                                <p-button *hasFeaturePermission="['BRN','edit']"
                                          icon="pi pi-pencil"
                                          severity="info"
                                          text
                                          raised
                                          rounded
                                          (click)="edit(branch)">
                                </p-button>

                                <p-button *hasFeaturePermission="['BRN','deleted']"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          raised
                                          rounded
                                          (click)="delete(branch)">
                                </p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- View User Dialog -->
        <p-dialog header="View Branch Details"
                  [(visible)]="displayDetails"
                  [modal]="true"
                  [style]="{ width: '1100px' }"
                  [closable]="true">
            <p-divider></p-divider>
            <div class="flex flex-col md:flex-row">
                <!-- Labels Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Branch code:</strong></div>
                    <div><strong>Branch prefix:</strong></div>
                    <div><strong>City/Province:</strong></div>
                    <div><strong>Email:</strong></div>
                    <div><strong>Address:</strong></div>
                    <div><strong>Clone GL from:</strong></div>
                    <div><strong>Description:</strong></div>
                </div>

                <!-- Values Column 1 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedBranch?.branch_code }}</div>
                    <div>{{ selectedBranch?.branch_prefix }}</div>
                    <div>{{ selectedBranch?.province?.label }}</div>
                    <div>{{ selectedBranch?.email }}</div>
                    <div>{{ selectedBranch?.address }}</div>
                    <div>{{ selectedBranch?.clone_gl_from_branch?.label || '-' }}</div>
                    <div>{{ selectedBranch?.description }}</div>
                </div>

                <!-- Labels Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div><strong>Branch name:</strong></div>
                    <div><strong>Local Branch name :</strong></div>
                    <div><strong>Phone:</strong></div>
                    <div><strong>Is HQ:</strong></div>
                    <div><strong>Online Status:</strong></div>
                </div>

                <!-- Values Column 2 -->
                <div class="w-full md:w-1/4 flex flex-col space-y-6 py-5">
                    <div>{{ selectedBranch?.branch_name }}</div>
                    <div>{{ selectedBranch?.local_branch_name }}</div>
                    <div>{{ selectedBranch?.phone }}</div>
                    <div>{{ selectedBranch?.isHq?.label }}</div>
                    <div>{{ selectedBranch?.online_status?.label }}</div>
                </div>
            </div>
        </p-dialog>

        <!-- Confirmation Dialog -->
        <p-confirmDialog></p-confirmDialog>
    `
})
export class BranchComponent {
    branchList: BranchModel[] = [];
    loading = [false];
    searchText = '';
    displayDetails = false;
    selectedBranch: BranchModel | null = null;

    constructor(
        private branchService: BranchService,
        private messageService: MessageService,
        private router: Router,
        private permissionService: FeaturePermissionService,
        private confirmationService: ConfirmationService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit() {
        forkJoin({
            branch: this.branchService.getAllBranch()
        }).subscribe({
            next: ({ branch }) => {
                this.branchList = branch;
            },
            error: (err) => {
                console.error('Initialization error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load initial data.'
                });
            }
        });
    }

    search() {
        this.loading[0] = true;
        this.branchService.searchBranch(this.searchText).subscribe({
            next: (Branch) => {
                this.branchList = Branch;
                this.loading[0] = false;
            },
            error: () => {
                this.loading[0] = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Search failed.'
                });
            }
        });
    }

    addNew() {
        this.router.navigate(['/add-branch']);
    }

    edit(branch: BranchModel) {
        this.router.navigate(['/edit-branch'], { state: { branch } });
        console.log(branch);
    }

    view(branch: BranchModel) {
        this.selectedBranch = branch;
        this.displayDetails = true;
    }

    delete(branch: BranchModel) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete role "${branch.branch_name}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.branchService.deleteBranch(branch.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: `Role "${branch.branch_name}" deleted successfully.`,
                            life: 3000
                        });
                        // remove from UI list
                        this.branchList = this.branchList.filter(r => r.id !== branch.id);
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete role.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
}

