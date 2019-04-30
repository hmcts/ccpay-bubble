# FeeRegisterSearch

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

# Module usage

To use the view payment module, firstly build the fee-register-search module (see below) and include the `FeeRegisterSearchModule` in the consuming module's declartions and imports array. The `pay-fee-register-search` will be available to the consuming module's components which can rendered in a template like so `<pay-fee-register-search [APIRoot]="" (selectedFeeEvent)=""></pay-fee-register-search>`.

@Input - `[APIRoot]`: String - The API address used to conduct a GET request to retrive fees.
@Output - `(selectedFeeEvent)`: Fee Object - Emits a fee object on selection of a paticular fee.

## Code scaffolding

Run `ng generate component component-name --project fee-register-search` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project fee-register-search`.
> Note: Don't forget to add `--project fee-register-search` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build fee-register-search` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build fee-register-search`, go to the dist folder `cd dist/fee-register-search` and run `npm publish`.

## Running unit tests

Run `ng test fee-register-search` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
