# PayBubbleWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

Please note this project uses yarn

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Important - The project's build dependens on library projects located in the projects folder. Run `ng build fee-register-search` and `ng build view payment` before compiling the main project.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

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

# Setup development environment

To be able to run angular-cli and node-express next to each other the best way to use bar-idam-mock to mock out third party dependencies. https://github.com/hmcts/bar-idam-mock

1. start mock server: `PORT=23443 npm run dev`
2. in **ccpay-payment-app** make the following changes in application-local.properties

```
auth.idam.client.baseUrl=http://localhost:23443
auth.provider.service.client.baseUrl=http://localhost:23443
```  

   Run the app with local config by setting up this environment variable: `spring_profiles_active=local`

3. in **ccpay-bubble** project `default.yaml` make the following changes:
```
idam:
  client_id: paybubble
  client_secret: [paybubble-idam-client-secret]
  login_url: http://localhost:23443/login
  api_url: http://localhost:23443
...
s2s:
  key: [paybubble-s2s-secret]
  url: http://localhost:23443
payhub:
  url: http://localhost:8080
...
fee:
  feeRegistrationUrl: http://localhost:23443/fees
  feeJurisdictionUrl: http://localhost:23443/jurisdictions
```  

   Run the following commands: `yarn start:angular-dev` and `yarn start:express:dev`


