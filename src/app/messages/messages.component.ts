import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-messages',
    imports: [CommonModule],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
