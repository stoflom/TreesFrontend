# SATrees frontend. 
Application to search with regular expressions for common names of 1600 Southern African Trees
in many languages. Links are then provided to wikipedia, SANBI and WFO sites where more details can be found.
The data is retrived by a nodejs/express/mongoose/mongodb backend. The data is not in the public domain.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0 but
has been upgraded to 21.1.0

## Development server 

Beware CORS issues, see: https://stackoverflow.com/questions/43150051/how-to-enable-cors-nodejs-with-express

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/` to access. 
The app will automatically reload if you change any of the source files. 

Run `ng serve --host 0.0.0.0`  for debug access from outside localhost. (Firewall must be openend first.)

### CORS 

CORS now configured in backend express server so proxy (see below) not needed anymore but
the backend cannot be accessed via localhost, ip address is required. (treehttp.service.ts)

#### proxy server

Refer:
    https://medium.com/bb-tutorials-and-thoughts/angular-how-to-proxy-to-backend-server-6fb37ef0d025
    https://www.positronx.io/handle-cors-in-angular-with-proxy-configuration/  (GOOD), 

Create file "proxy.json" containing e.g. (do not use "localhost")

```
{
  "/api": {
    "target": "http://192.168.0.10:5002",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```
    
NOTE:The "proxy.json" configuration should refer to "/api", not "/api/*" as in some documents.    
    
Start frontend as follows to enable fetching via proxy from backend

`ng  serve --proxy-config proxy.json`

Alternatively configure these options directly in "angular.json" so it need not be given when starting
```
 "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "proxyConfig": "./proxy.json",
            "host": "0.0.0.0"
          }
```



## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

See `ng generate --help`

## Lint

Run `ng lint TreesFrontend`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Not implemented :-)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
