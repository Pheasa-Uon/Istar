import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <div class="flex justify-between items-center">
            © Copyright 2025-2025. All Rights Reserved. Power by
        </div>
        <div class="flex justify-between items-center">
            <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Istar Core Banking Cambodia</a>
        </div>
    </div>`
})
export class AppFooter {}
