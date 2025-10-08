import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ExchangeRateService } from '../../../service/administrator/systemAdmin/exchange-rate.service';
import { ExchangeRateRequest, ExchangeRateResponse } from '../../../model/administrator/systemAdmin/exchange.rate.model';

@Component({
    selector: 'app-exchange-rate',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule],
    providers: [MessageService],
    template: `
        <div class="card p-4">
            <h2 class="text-xl font-semibold mb-4 text-primary">Exchange Rate Management</h2>

            <!-- Form Section -->
            <div class="grid grid-cols-4 gap-4 mb-5">
                <div>
                    <label class="block mb-1 font-medium">Currency Code</label>
                    <input pInputText [(ngModel)]="exchangeRate.currencyCode" placeholder="e.g. USD" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1 font-medium">System Rate</label>
                    <input type="number" pInputText [(ngModel)]="exchangeRate.systemRate" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1 font-medium">Bid Rate</label>
                    <input type="number" pInputText [(ngModel)]="exchangeRate.bidRate" class="w-full" />
                </div>
                <div>
                    <label class="block mb-1 font-medium">Ask Rate</label>
                    <input type="number" pInputText [(ngModel)]="exchangeRate.askRate" class="w-full" />
                </div>
            </div>

            <button pButton label="Add Exchange Rate" icon="pi pi-plus" (click)="addExchangeRate()"></button>

            <p-table [value]="exchangeRates" class="mt-5" [paginator]="true" [rows]="10" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Currency Code</th>
                        <th>System Rate</th>
                        <th>Bid Rate</th>
                        <th>Ask Rate</th>
                        <th>Created By</th>
                        <th>Created Date</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                    <tr>
                        <td>{{ row.currencyCode }}</td>
                        <td>{{ row.systemRate }}</td>
                        <td>{{ row.bidRate }}</td>
                        <td>{{ row.askRate }}</td>
                        <td>{{ row.createdBy || '-' }}</td>
                        <td>{{ row.createdDate | date:'short' }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class ExchangeRateComponent implements OnInit {
    exchangeRates: ExchangeRateResponse[] = [];
    exchangeRate: ExchangeRateRequest = {
        currencyCode: '',
        systemRate: 0,
        bidRate: 0,
        askRate: 0
    };

    constructor(
        private exchangeRateService: ExchangeRateService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadExchangeRates();
    }

    loadExchangeRates(): void {
        this.exchangeRateService.getAll().subscribe({
            next: (data) => (this.exchangeRates = data),
            error: (err) => console.error('Failed to load exchange rates', err)
        });
    }

    addExchangeRate(): void {
        if (!this.exchangeRate.currencyCode || !this.exchangeRate.systemRate) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Currency code and system rate are required.' });
            return;
        }

        this.exchangeRateService.create(this.exchangeRate).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Exchange rate added successfully!' });
                this.exchangeRates.push(res);
                this.exchangeRate = { currencyCode: '', systemRate: 0, bidRate: 0, askRate: 0 };
            },
            error: (err) => {
                console.error('Error adding exchange rate', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add exchange rate' });
            }
        });
    }
}
