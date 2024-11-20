import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

//This should use the database but for now we will use a cookie.

@Injectable({
  providedIn: 'root'
})
export class PersistService {

  constructor(private cookieService: CookieService) { };

  private cookieName: string = 'SearchParams';

  public retrieve() {
    if (this.cookieService.check(this.cookieName)) {
      return JSON.parse(this.cookieService.get(this.cookieName)) as object;  //Read cookie if available
    } else
    return null;
  };

  public persist(aobject: object) {
    //store cookies
    this.cookieService.set(this.cookieName, JSON.stringify(aobject));
  };

}
