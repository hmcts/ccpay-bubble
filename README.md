# PayBubble Web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.

Please note this project uses yarn

## Installation

to install all the libraries into the node module run `yarn install` on the terminal

## Build

You can run the following commands to build all components in PayBubble using yarn:
1. `yarn ng:build` and
2. `yarn postbuild`

Remember to remove the `dist` and `.angular` folders before running the build commands to ensure a clean build using the latest code.

Important - The project's build depends on library projects located in the projects folder. To build these manually, you can run the following commands:
Run
1. `ng build fee-register-search` and
2. `ng build view-payment`
3. Run `ng build`

## Development server

Run `yarn start:express-dev`. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

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

# Setup development environment

Running PayBubble locally connecting to an environment for CCD and IdAM you can use the following:
`yarn start:express-dev`. Navigate to `http://localhost:3000/`. 

To be able to run angular-cli and node-express next to each other the best way to use bar-idam-mock to mock out third party dependencies. https://github.com/hmcts/bar-idam-mock

1. start mock server: `PORT=23443 npm run dev`
2. in **ccpay-payment-app** make the following changes in application-local.properties

```
auth.idam.client.baseUrl=http://localhost:23443
auth.provider.service.client.baseUrl=http://localhost:23443
```
Run the app with local config by setting up this environment variable: `spring_profiles_active=local`
Run the following commands: `yarn start:angular-dev` and `yarn start:express-dev`

If you are running `yarn start:angular-dev` you'll need to connect using the following URL: `http://localhost:4200/`.

# Running Tests

## Prerequisites

- Connected to the VPN (so internal `.internal` URLs resolve)
- Logged in to the Azure CLI (`az login`)

## Functional Tests (`scripts/run-functional-tests.sh`)

Runs codeceptjs functional tests against a deployed environment.

```bash
# all @pipeline tests against AAT (default)
./scripts/run-functional-tests.sh

# all tests against demo
./scripts/run-functional-tests.sh demo

# run a tag filter
./scripts/run-functional-tests.sh --grep "@serial"

# run a specific scenario
./scripts/run-functional-tests.sh --grep "Upfront remission added after failed Telephony Payment"

# debug mode
./scripts/run-functional-tests.sh --debug --grep "@pipeline"

# override the env file
./scripts/run-functional-tests.sh demo --grep "Upfront remission"
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `<env>` | Target environment (e.g. `aat`, `demo`) | `aat` |
| `--grep <pattern>` / `-g` | Run only tests matching the tag or scenario name | all `@pipeline` + `@nightly` scenarios |
| `--debug` | Enable debug output | off |

## Cross-Browser Tests (`scripts/run-cross-browser-tests.sh`)

Runs Playwright cross-browser tests (chromium, firefox, webkit) against a deployed environment.

```bash
# all @pipeline tests against AAT (default)
./scripts/run-functional-tests.sh

# all tests against demo
./scripts/run-functional-tests.sh demo

# run a tag filter
./scripts/run-functional-tests.sh --grep "@serial"

# run a specific scenario
./scripts/run-functional-tests.sh --grep "Upfront remission added after failed Telephony Payment"

# debug mode
./scripts/run-functional-tests.sh --debug --grep "@pipeline"

# override the env file
./scripts/run-functional-tests.sh demo --grep "Upfront remission"
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `<env>` | Target environment (e.g. `aat`, `demo`) as positional argument | `aat` |
| `--grep <pattern>` / `-g` | Run only tests matching the tag or scenario name | all `@pipeline` + `@nightly` scenarios |
| `--debug` | Enable debug output | off |

## Cross-Browser Tests (`scripts/run-cross-browser-tests.sh`)

Runs Playwright cross-browser tests (chromium, firefox, webkit) against a deployed environment.

```bash
# all browsers against AAT (default)
./scripts/run-cross-browser-tests.sh

# run only Firefox
./scripts/run-cross-browser-tests.sh --browser firefox

# run all browsers against demo
./scripts/run-cross-browser-tests.sh demo

# show the browser during the test run
./scripts/run-cross-browser-tests.sh --show

# run a specific tag filter
./scripts/run-cross-browser-tests.sh --grep "@crossbrowser"

# run a specific scenario with browser showing
./scripts/run-cross-browser-tests.sh --show --grep "Amount Due case for Telephony"

# debug mode with only Firefox
./scripts/run-cross-browser-tests.sh --browser firefox --debug --grep "@crossbrowser"
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `<env>` | Target environment (e.g. `aat`, `demo`) as positional argument | `aat` |
| `--grep <pattern>` / `-g` | Run only tests matching the tag or scenario name | `@crossbrowser` |
| `--show` | Display the browser during test execution | off |
| `--browser <browser>` | Run only the specified browser (`chromium`, `firefox`, `webkit`) | all browsers |
| `--debug` | Enable debug output | off |

### Secrets

Secrets are loaded from Azure Key Vault at runtime and never persisted or committed. The following secrets are fetched from the `ccpay-<env>` vault:

- `probate-caseworker-username` / `probate-caseworker-password`
- `divorce-caseworker-username` / `divorce-caseworker-password`
- `refunds-requestor-caseworker-username` / `refunds-requestor-caseworker-password`
- `refunds-approver-caseworker-username` / `refunds-approver-caseworker-password`
- `freg-editor-username` / `freg-editor-password`
- `freg-approver-username` / `freg-approver-password`
- `freg-admin-username` / `freg-admin-password`
- `fee-pay-divorce-client-id` / `fee-pay-divorce-client-secret` / `fee-pay-divorce-client-redirect-url`
- `citizen-oauth-client-secret`
- `cmc-service-secret`
- `notifications-email-apikey`
- `paybubble-s2s-secret`
- `paybubble-idam-client-secret`
- `launch-darkly-client-id`
- `app-insights-connection-string`

### Test Output

- Reports: `functional-output/cross-browser/reports/`
- Videos: `functional-output/cross-browser/videos/`
- Allure report: `functional-output/cross-browser/allure/`
