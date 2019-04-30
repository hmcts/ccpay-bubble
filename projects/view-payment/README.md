# ViewPayment

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

# Module usage

To use the view payment module, firstly build the view-payment module (see below) and include the `ViewPaymentModule` in the consuming module's declartions and imports array. The `ccpay-view-payment` will be available to the consuming module's components which can rendered in a template like so `<ccpay-view-payment [paymentReference]=""></ccpay-view-payment>`.

@Input - `[paymentReference]`: String - Accepts a payment reference to retrive and display data on a single payment object.

## Code scaffolding

Run `ng generate component component-name --project view-payment` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project view-payment`.
> Note: Don't forget to add `--project view-payment` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build view-payment` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build view-payment`, go to the dist folder `cd dist/view-payment` and run `npm publish`.

## Running unit tests

Run `ng test view-payment` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
