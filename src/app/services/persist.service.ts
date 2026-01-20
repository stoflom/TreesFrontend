import { Injectable } from '@angular/core';

//This should use the database or be stored statically here,
// but for now we will use localStorage which allows the user the choice
// of persistence across sessions.

@Injectable({
  providedIn: 'root'
})
export class PersistService {

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
    } catch (error) {
      // localStorage failed
    }
    return null;
  }

  public persist(aobject: object) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(aobject));
    } catch (error) {
      // localStorage failed, but continue
    }
    this.localData = aobject;
  }

}
