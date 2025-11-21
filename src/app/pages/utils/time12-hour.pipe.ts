// time12-hour.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { parse, format } from 'date-fns';

@Pipe({ name: 'time12Hour' })
export class Time12HourPipe implements PipeTransform {
    transform(time?: string): string {
        if (!time) return '';
        try {
            const date = parse(time, 'HH:mm:ss', new Date());
            return format(date, 'hh:mm a'); // e.g., "08:00 AM"
        } catch (e) {
            console.error('Invalid time:', time, e);
            return '';
        }
    }
}
