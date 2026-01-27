import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vegetation',
  imports: [],
  templateUrl: './vegetation.html',
  styleUrl: './vegetation.css',
})
export class Vegetation {
  @Input() vegtypes: string[] = [];
}
