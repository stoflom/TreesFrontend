import { Injectable, inject } from '@angular/core';
import { MessageService } from './message.service';

//This should use the database or be stored statically here,
// but for now we will use localStorage which allows the user the choice
// of persistence across sessions.

@Injectable({
  providedIn: 'root'
})
export class PersistService {

  private messageService = inject(MessageService);

  private storageKey = 'SearchParams';
  private localData: object | null = null;

  public retrieve() {
    if (this.localData !== null) {
      return this.localData;
    }
    try {
      const item = localStorage.getItem(this.storageKey);
      if (item) {
        this.localData = JSON.parse(item) as object;
        return this.localData;
      }
    } catch  {
      // localStorage failed
      this.log('Warning: Unable to retrieve data from localStorage.');
    }
    return null;
  }

  public persist(aobject: object) {
    this.localData = aobject;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(aobject));
    } catch {
      // localStorage failed, but continue
      this.log('Warning: Unable to persist data to localStorage.');
    }
    
  }

   /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PersistService: ${message}`);
  }
}

