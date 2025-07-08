import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppMessage {
    severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
    summary: string;
    detail: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    private _messages = new BehaviorSubject<AppMessage[]>([]);
    messages$ = this._messages.asObservable();

    show(msg: AppMessage) {
        const current = this._messages.getValue();
        this._messages.next([...current, msg]);

        setTimeout(() => {
            this._messages.next(this._messages.getValue().filter(m => m !== msg));
        }, 3000); // Auto dismiss
    }

    clear() {
        this._messages.next([]);
    }
}
