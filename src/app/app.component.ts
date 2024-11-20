import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';

@Component({
    selector: 'app-root',
    imports: [
      RouterOutlet,
      MessagesComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TreesFrontend';
}
