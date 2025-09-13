import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],  // 👈 add providers here
    template: `
        <p-toast></p-toast>
        <router-outlet></router-outlet>
        <p-confirmDialog></p-confirmDialog>
  `
})
export class AppComponent {}
