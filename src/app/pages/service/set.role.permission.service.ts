import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable()
export class SetRolePermissionService {
    getTreeTableNodesData() {
        return [
            {
                key: '1',
                data: {
                    name: 'Reports',
                    descrition: '100kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '1-1',
                        data: {
                            name: 'Operation',
                            descrition: '25kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '1-1-1',
                                data: {
                                    name: 'Collateral',
                                    descrition: '10kb',
                                    type: 'Folder'
                                },
                                children: [
                                    {
                                        key: '1-1-1-1',
                                        data: {
                                            name: 'Stock Report',
                                            descrition: '25kb',
                                            type: 'Report'
                                        }
                                    }
                                ]
                            },
                            {
                                key: '1-1-2',
                                data: {
                                    name: 'Deposit',
                                    descrition: '10kb',
                                    type: 'Folder'
                                }
                            },
                            {
                                key: '1-1-3',
                                data: {
                                    name: 'Loan',
                                    descrition: '5kb',
                                    type: 'Folder'
                                }
                            }
                        ]
                    },
                    {
                        key: '2-1',
                        data: {
                            name: 'Finance',
                            descrition: '25kb',
                            type: 'Folder'
                        },
                        children: [
                            {
                                key: '2-1-1',
                                data: {
                                    name: 'Deposit',
                                    descrition: '10kb',
                                    type: 'Folder'
                                }
                            },
                            {
                                key: '1-1-2',
                                data: {
                                    name: 'Fixed Assets',
                                    descrition: '10kb',
                                    type: 'Folder'
                                }
                            },
                            {
                                key: '1-1-3',
                                data: {
                                    name: 'Loan',
                                    descrition: '5kb',
                                    type: 'Folder'
                                }
                            },
                            {
                                key: '1-1-4',
                                data: {
                                    name: 'Source of Fund',
                                    descrition: '5kb',
                                    type: 'Folder'
                                }
                            }
                        ]
                    },
                ]
            },
            {
                key: '2',
                data: {
                    name: 'Users Management',
                    descrition: '20kb',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '2-1',
                        data: {
                            name: 'Users Profile',
                            descrition: '10kb',
                            type: 'Application'
                        }
                    },
                    {
                        key: '2-2',
                        data: {
                            name: 'Role Permissions',
                            descrition: '10kb',
                            type: 'Application'
                        }
                    }
                ]
            },
        ];
    }

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData());
    }


}
