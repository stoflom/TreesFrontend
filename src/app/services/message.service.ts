import { Service, signal } from '@angular/core';


@Service()
export class MessageService {
  messages = signal<string[]>([]);


  add(message: string) {
    this.messages.update((msgs) => [...msgs, message]);
  }


  clear() {
    this.messages.set([]);
  }
}
