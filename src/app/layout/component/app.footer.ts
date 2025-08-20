import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
            <div class="flex justify-between items-center md:w-1/2 w-full mx-auto px-4 py-2">

                <!-- Left side: copyright -->
                <div class="flex gap-2 items-center text-right">
                    © Copyright 2019-2025. All Rights Reserved. Powered by
                    <a href="https://primeng.org"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="text-primary font-bold hover:underline">
                        Istar Business Intelligence Cambodia
                    </a>
                </div>

                <!-- Right side: version -->
                <div class="flex gap-2 items-center">
                    version 1.0.0
                </div>
            </div>
        </div>
    `
})
export class AppFooter {}
