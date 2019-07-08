# PayBubbleWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

Please note this project uses yarn

## Installation

to install all the libraries into the node module run `yarn install` on the terminal

## Build

Important - The project's build dependens on library projects located in the projects folder. 
Run 
  1. `ng build fee-register-search` and 
  2. `ng build view payment` 
  3. Run `ng build` 
  4. yarn build
  to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

  or shortcut to do all these by running `yarn ng:build`

## Development server

Run `yarn start`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `yarn test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## View payment - Web Component

The view payment web component can be accessed via /view-payment/ref
ref route parameter references a valid payment reference.

Please see (https://github.com/hmcts/ccpay-bubble/tree/master/projects/view-payment) for more detail.

## Fee register search - Web Component

The fee register search component can be accessed via /fee-search

Please see (https://github.com/hmcts/ccpay-bubble/tree/master/projects/fee-register-search) for more detail.

## Further help - dummy

To get more help on thee Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
# ccpay-bubble


# Preview Environment
We get a fully functional environment in Azure Kubernetes (AKS) per pull request. For more info see: https://tools.hmcts.net/confluence/display/ROC/AKS+-+Azure+Managed+Kubernetes
