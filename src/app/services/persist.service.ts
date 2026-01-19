import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

//This should use the database or be stored statically here,
// but for now we will use a cookie which allows the user the choice
// of persistence across sesssions.

@Injectable({
  providedIn: 'root'
})
export class PersistService {
  private cookieService = inject(CookieService);
;

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
