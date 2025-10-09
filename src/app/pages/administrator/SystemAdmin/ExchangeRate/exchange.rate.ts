import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ExchangeRateService } from '../../../service/administrator/systemAdmin/exchange.rate.service';
import { ExchangeRateResponse, ExchangeRateRequest } from '../../../model/administrator/systemAdmin/exchange.rate.model';
import { FeaturePermissionService } from '../../../service/administrator/usersManagement/userpermissions/feature.permission.service';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';
import { CurrencyService } from '../../../service/administrator/system/currency.service';
import { SystemDateService } from '../../../../layout/service/system.date.service';
import { SystemDateModel } from '../../../model/system.date.model';
import { Currency } from '../../../model/administrator/system/currency.model';

@Component({
    selector: 'app-exchange-rate',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, HasPermissionDirective],
    providers: [MessageService],
    template: `
        <div class="card p-4">
            <h2 class="text-xl font-semibold mb-4 text-primary">💱 Exchange Rate</h2>

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
        private exchangeRateService: ExchangeRateService,
        private permissionService: FeaturePermissionService,
        private currencyService: CurrencyService,
        private systemDateService: SystemDateService,
        private messageService: MessageService
    ) {
        this.permissionService.loadPermissions();
        this.permissionService.loadFromCache();
    }

    ngOnInit(): void {
        this.loadSystemDate();
        this.loadCurrencies();
        this.loadExchangeRates();
    }

    /** Load active system date */
    private loadSystemDate(): void {
        this.systemDateService.getSystemDateIsActive().subscribe({
            next: (data) => {
                this.systemDate = data[0];
                this.tryInitializeExchangeRates();
            },
            error: (err) => console.error('❌ Failed to load system date', err)
        });
    }

    /** Load available currencies */
    private loadCurrencies(): void {
        this.currencyService.getCurrency().subscribe({
            next: (data) => {
                this.currencies = data;
                this.tryInitializeExchangeRates();
            },
            error: (err) => console.error('❌ Failed to load currencies', err)
        });
    }

    /** Load existing exchange rates (for editing) */
    private loadExchangeRates(): void {
        this.exchangeRateService.GetExchangeRate().subscribe({
            next: (data) => {
                this.exchangeRates = data;
                this.tryInitializeExchangeRates();
            },
            error: (err) => console.error('❌ Failed to load exchange rates', err),
        });
    }

    /** Initialize exchange rates only when both systemDate & currencies are ready */
    private tryInitializeExchangeRates(): void {
        if (this.systemDate && this.currencies.length > 0 && this.exchangeRates.length === 0) {
            this.initializeExchangeRates();
        }
    }

    /** Prepare initial list of exchange rates */
    private initializeExchangeRates(): void {
        if (!this.systemDate) return;

        this.exchangeRates = this.currencies.map(cur => ({
            id: 0,
            currency: cur, // ✅ includes value + label
            system_rate: 0,
            bid_rate: 0,
            ask_rate: 0,
            system_date_id: this.systemDate?.id ?? 0,
            system_date: this.systemDate?.systemDate ?? new Date().toISOString().split('T')[0]
        }));

        console.log('✅ Initialized exchange rates:', this.exchangeRates);
    }

    /** Save all exchange rates */
    saveAll(): void {
        const requests: ExchangeRateRequest[] = this.exchangeRates.map(r => ({
            currency: r.currency.value, // ✅ use numeric ID field
            system_date_id: r.system_date_id,
            system_date: r.system_date,
            system_rate: r.system_rate ?? 0,
            bid_rate: r.bid_rate ?? 0,
            ask_rate: r.ask_rate ?? 0
        }));

        console.log('📤 Prepared requests:', requests);

        this.exchangeRateService.CreateExchangeRateBulk(requests).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Saved',
                    detail: 'Exchange rates saved successfully!'
                });
                this.initializeExchangeRates();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save exchange rates!'
                });
                console.error('❌ Save failed:', err);
            }
        });
    }
}
