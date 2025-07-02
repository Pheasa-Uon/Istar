import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        © Copyright 2019-2025. All Rights Reserved. Power by
        <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">CIDI Core Banking</a>
    </div>`
})
export class AppFooter {}
