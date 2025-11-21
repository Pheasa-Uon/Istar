import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ExchangeRateResponse, ExchangeRateRequest } from '../../../model/administrator/systemAdmin/exchange.rate.model';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { Currency } from '../../../model/administrator/system/currency.model';
import { SystemDateModel } from '../../../model/system.date.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { forkJoin, switchMap, of } from 'rxjs';
import { MessageService } from '../../../message/message.service';
import { MessagesComponent } from '../../../message/message';

@Component({
    selector: 'app-exchange-rate',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, HasPermissionDirective, MessagesComponent],
    template: `
        <app-messages></app-messages>

        <div class="card p-4">
            <div class="font-semibold text-xl mb-4">💱 Exchange Rate</div>

            <p-table [value]="exchangeRates" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Currency</th>
                        <th>System Rate</th>
                        <th>Bid Rate</th>
                        <th>Ask Rate</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rate>
                    <tr>
                        <td>{{ rate.currency.label }}</td>
                        <td><input type="number" [(ngModel)]="rate.system_rate" class="p-inputtext p-component w-full" /></td>
                        <td><input type="number" [(ngModel)]="rate.bid_rate" class="p-inputtext p-component w-full" /></td>
                        <td><input type="number" [(ngModel)]="rate.ask_rate" class="p-inputtext p-component w-full" /></td>
                    </tr>
                </ng-template>
            </p-table>

            <div class="mt-4 flex flex-wrap gap-0 w-full justify-end">
                <p-button
                    *hasFeaturePermission="['EXR', 'save']"
                    label="Save"
                    icon="pi pi-save"
                    (click)="saveAll()"
                ></p-button>
            </div>
        </div>
    `
})
export class ExchangeRateComponent implements OnInit {
    exchangeRates: ExchangeRateResponse[] = [];
    currencies: Currency[] = [];
    systemDate?: SystemDateModel;

    constructor(
        private http: HttpClient,
        private permissionService: FeaturePermissionService,
        private messageService: MessageService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        this.loadInitialData();
    }

    /** Get authentication headers */
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    /** Update exchange rate to inactive */
    private updateExchangeRateToInactive(id: number) {
        const headers = this.getAuthHeaders();
        return this.http.put(
            `${environment.apiBase}${environment.apiEndpoints.systemAdmin.exchangeRate}/inactive/${id}`,
            {},
            {
                headers,
                responseType: 'text' as 'json' // Handle any response format
            }
        );
    }

    /** Load all data at once */
    private loadInitialData(): void {
        const headers = this.getAuthHeaders();

        forkJoin({
            systemDate: this.http.get<SystemDateModel[]>(
                `${environment.apiBase}${environment.apiEndpoints.systemDate}/active`,
                { headers }
            ),
            currencies: this.http.get<Currency[]>(
                `${environment.apiBase}${environment.apiEndpoints.system.currency}/currency-dropdown`,
                { headers }
            ),
            exchangeRates: this.http.get<ExchangeRateResponse[]>(
                `${environment.apiBase}${environment.apiEndpoints.systemAdmin.exchangeRate}/active`,
                { headers }
            )
        }).subscribe({
            next: (results) => {
                this.systemDate = results.systemDate[0];
                this.currencies = results.currencies;
                this.exchangeRates = results.exchangeRates;

                // Debug: Check the structure of exchange rate currencies
                console.log('🔍 Exchange Rate Currencies Structure:');
                if (this.exchangeRates.length > 0) {
                    this.exchangeRates.forEach((rate, index) => {
                        console.log(`Rate ${index} currency:`, rate.currency);
                        console.log(`Rate ${index} currency keys:`, Object.keys(rate.currency));
                    });
                }

                // Initialize if no existing rates
                if (this.exchangeRates.length === 0) {
                    this.initializeExchangeRates();
                } else {
                    // Fix the currency objects in existing rates
                    this.fixCurrencyObjects();
                }

                console.log('✅ All data loaded successfully');
            },
            error: (err) => {
                console.error('❌ Failed to load initial data:', err);

                let errorDetail = 'Failed to load data!';
                if (err.status === 403) {
                    errorDetail = 'Access denied. Please check your permissions or authentication.';
                } else if (err.status === 401) {
                    errorDetail = 'Unauthorized. Please login again.';
                }

                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail
                });
            }
        });
    }

    /** Fix currency objects in existing exchange rates */
    private fixCurrencyObjects(): void {
        console.log('🔄 Fixing currency objects in existing exchange rates...');

        this.exchangeRates = this.exchangeRates.map(rate => {
            // If currency has 'value' instead of 'id', fix it
            const currencyObj = rate.currency as any;
            if (currencyObj.value && !currencyObj.id) {
                console.log('🔄 Fixing currency:', currencyObj);
                return {
                    ...rate,
                    currency: {
                        id: currencyObj.value, // Use value as id
                        label: currencyObj.label
                    }
                };
            }
            return rate;
        });

        console.log('✅ Fixed exchange rates:', this.exchangeRates);
    }

    /** Prepare initial list of exchange rates */
    private initializeExchangeRates(): void {
        if (!this.systemDate) return;

        this.exchangeRates = this.currencies.map(cur => ({
            id: 0,
            currency: cur,
            system_rate: 0,
            bid_rate: 0,
            ask_rate: 0,
            system_date_id: this.systemDate!.id,
            system_date: this.systemDate!.systemDate
        }));

        console.log('✅ Initialized exchange rates:', this.exchangeRates);
    }

    /** Save all exchange rates */
    saveAll(): void {
        // Validate data first
        if (!this.systemDate?.id) {
            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: 'System date is not available!'
            });
            return;
        }

        // Create requests - handle both id and value properties
        const requests: ExchangeRateRequest[] = this.exchangeRates.map(r => {
            const currencyObj = r.currency as any;

            // Get currency ID - handle both 'id' and 'value' properties
            const currencyId = currencyObj.id || currencyObj.value;

            console.log('💰 Currency ID resolved:', {
                currency: currencyObj,
                id: currencyObj.id,
                value: currencyObj.value,
                finalId: currencyId
            });

            if (!currencyId) {
                console.error('❌ Cannot find currency ID:', currencyObj);
            }

            return {
                currency_id: currencyId!,
                system_date_id: this.systemDate!.id,
                system_date: this.systemDate!.systemDate,
                system_rate: r.system_rate ?? 0,
                bid_rate: r.bid_rate ?? 0,
                ask_rate: r.ask_rate ?? 0
            };
        });

        console.log('📤 Prepared requests:', requests);

        // Validate requests
        const invalidRequests = requests.filter(req => !req.currency_id || !req.system_date_id);
        if (invalidRequests.length > 0) {
            console.error('❌ Invalid requests found:', invalidRequests);

            this.messageService.show({
                severity: 'error',
                summary: 'Error',
                detail: `Missing currency IDs in ${invalidRequests.length} requests. Check console for details.`
            });
            return;
        }

        console.log('✅ All requests are valid');

        // Step 1: Deactivate existing rates (only those with IDs > 0)
        const ratesToDeactivate = this.exchangeRates.filter(rate => rate.id > 0);
        const deactivationCalls = ratesToDeactivate.map(rate =>
            this.updateExchangeRateToInactive(rate.id)
        );

        console.log('🔧 Deactivating rates:', ratesToDeactivate.length);

        // Step 2: Run all deactivate calls, then create new ones
        const deactivationObservable = deactivationCalls.length > 0
            ? forkJoin(deactivationCalls)
            : of([]);

        const headers = this.getAuthHeaders();

        deactivationObservable.pipe(
            switchMap(() => {
                console.log('✅ Deactivation completed, creating new rates...');
                // Use responseType: 'text' to handle any response format including empty responses
                return this.http.post(
                    `${environment.apiBase}${environment.apiEndpoints.systemAdmin.exchangeRate}/bulk`,
                    requests,
                    {
                        headers,
                        responseType: 'text' as 'json' // This will handle empty or malformed responses
                    }
                );
            })
        ).subscribe({
            next: (response: any) => {
                console.log('✅ Save successful - Response:', response);

                // Handle empty or any response format
                if (response === '' || response === null || response === undefined) {
                    console.log('✅ Server returned empty response (common for successful POST operations)');
                }

                this.messageService.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Exchange rates saved successfully!'
                });

                // Reload data to get updated exchange rates
                this.loadInitialData();
            },
            error: (err) => {
                console.error('❌ Save failed - Full error:', err);
                console.error('❌ Error status:', err.status);
                console.error('❌ Error message:', err.message);

                let errorDetail = 'Exchange rates save failed. Please try again.';

                if (err.status === 403) {
                    errorDetail = 'Access denied. Please check your permissions.';
                } else if (err.status === 401) {
                    errorDetail = 'Unauthorized. Please login again.';
                } else if (err.status === 200) {
                    // Special case: Server returns 200 but Angular treats it as error
                    // This usually means empty response or response format issue
                    // Since it's 200, we treat it as success
                    console.warn('⚠️ Server returned 200 but Angular encountered parsing error - treating as success');

                    this.messageService.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Exchange rates saved successfully!'
                    });

                    // Reload data anyway since the server accepted the request
                    this.loadInitialData();
                    return; // Don't show error message
                } else if (err.error?.message) {
                    errorDetail = err.error.message;
                }

                this.messageService.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail
                });
            }
        });
    }
}
