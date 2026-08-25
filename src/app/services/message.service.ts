import { Service, signal } from '@angular/core';


@Service()
export class MessageService {
  messages = signal<string[]>([]);

  // Keep the in-memory list bounded during long sessions.
  private static readonly MAX_MESSAGES = 50;

  add(message: string) {
    this.messages.update((msgs) => [...msgs, message].slice(-MessageService.MAX_MESSAGES));
  }


  clear() {
    this.messages.set([]);
  }
}
