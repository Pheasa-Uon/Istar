import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, AppMessage } from './message.service';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="message-container">
            <div *ngFor="let msg of messages" class="p-message" [ngClass]="'p-message-' + msg.severity">
                <span class="p-message-summary" *ngIf="msg.summary">{{ msg.summary }}</span>
                <span class="p-message-detail">{{ msg.detail }}</span>
            </div>
        </div>
    `,
    styles: [`
        .message-container {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            z-index: 1000;
        }
        .p-message {
            padding: 10px 15px;
            margin-bottom: 10px;
            border-radius: 4px;
            color: #fff;
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            animation: fadein 0.3s;
        }
        .p-message-success { background-color: #4caf50; }
        .p-message-info { background-color: #2196f3; }
        .p-message-warn { background-color: #ff9800; }
        .p-message-error { background-color: #f44336; }
        .p-message-secondary { background-color: #6c757d; }
        .p-message-contrast { background-color: #000000; }

        .p-message-summary { font-weight: 600; margin-right: 5px; }
        .p-message-detail {}

        @keyframes fadein {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `]
})
export class MessagesComponent {
    messages: AppMessage[] = [];

    constructor(private messageService: MessageService) {
        this.messageService.messages$.subscribe(msgs => this.messages = msgs);
    }
}
