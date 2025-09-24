// date-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { parseISO, format } from 'date-fns';

@Pipe({ name: 'formatDate' })
export class DateFormatPipe implements PipeTransform {
    transform(date?: string | Date): string {
        if (!date) return '';
        try {
            const d = typeof date === 'string' ? parseISO(date) : date;
            return format(d, 'dd/MM/yyyy'); // Example: 2025-09-30
        } catch (e) {
            console.error('Invalid date:', date, e);
            return '';
        }
    }
}
