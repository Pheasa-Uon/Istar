// message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
    severity: 'success' | 'info' | 'warn' | 'error';
    summary: string;
    detail: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    private _messages = new BehaviorSubject<Message[]>([]);
    public messages$: Observable<Message[]> = this._messages.asObservable();

    add(message: Message) {
        const currentMessages = this._messages.getValue();
        this._messages.next([...currentMessages, message]);
        this.autoClear();
    }

    clear() {
        this._messages.next([]);
    }

    private autoClear() {
        setTimeout(() => this.clear(), 5000); // clear after 5 seconds
    }
}
