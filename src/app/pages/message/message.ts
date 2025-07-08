import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { MessageService, AppMessage } from './message.service'; // adjust path as needed

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule, MessageModule],
    template: `
        <div class="flex flex-col md:flex-row gap-2">
            <div class="md:w-1/2">
                <div class="flex flex-col gap-2">
                    <p-message *ngFor="let msg of messages"
                               [severity]="msg.severity"
                               [text]="msg.detail"
                               [closable]="true">
                    </p-message>
                </div>
            </div>
        </div>
    `
})
export class Message {
    messages: AppMessage[] = [];

    constructor(private messageService: MessageService) {
        this.messageService.messages$.subscribe(msgs => {
            this.messages = msgs;
        });
    }
}
