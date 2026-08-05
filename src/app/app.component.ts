import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { VersionService } from './services/version.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MessagesComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dictionary of Names for Southern African Trees';
  version = '';

  constructor(private versionService: VersionService) {}

  async ngOnInit(): Promise<void> {
    this.version = await this.versionService.getVersion();
  }
}
