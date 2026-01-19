# SATrees frontend: Based on AngularTourOfHeroes demo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server, beware CORS issues, see: https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --host 0.0.0.0`  for debug access from outside localhost. (Firewall must be openend first.)

### NOTE CORS now configured in backend server so proxy (see below) not needed
### anymore.
### CORS: start frontend as follows to enable fetching via proxy from backend: (to prevent CORS problems):
 https://medium.com/bb-tutorials-and-thoughts/angular-how-to-proxy-to-backend-server-6fb37ef0d025
 https://www.positronx.io/handle-cors-in-angular-with-proxy-configuration/  (GOOD), or

### set "proxyConfig" in angular.json 
ng  serve --proxy-config proxy.json
##Alternatively configure these options in angular.json
....
 "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "proxyConfig": "./proxy.json",
            "host": "0.0.0.0"
          },...
### NOTE:The proxy.json configuration should refer to "/api", not "/api/*"

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

See `ng generate --help`

## Lint

Run `ng lint TreesFrontend`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests


Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
