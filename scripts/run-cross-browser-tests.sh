#!/usr/bin/env bash
#
# Run the PayBubble cross-browser Playwright tests against a deployed environment
# (AAT by default, configurable to demo, etc.).
#
# Environment variables and secrets are sourced from the Jenkinsfile_nightly pipeline.
# Secret VALUES are fetched from Azure Key Vault at runtime and never persisted or
# committed - only the vault/secret names and target env var names live in this file.
#
#   ./scripts/run-cross-browser-tests.sh                       # all browsers against AAT
#   ./scripts/run-cross-browser-tests.sh demo                  # all tests against demo
#   ./scripts/run-cross-browser-tests.sh --grep "@crossbrowser"  # run a tag filter
#   ./scripts/run-cross-browser-tests.sh demo --grep "Upfront remission"
#   ./scripts/run-cross-browser-tests.sh --show --grep "@crossbrowser"
#   ./scripts/run-cross-browser-tests.sh --show
#   ./scripts/run-cross-browser-tests.sh --browser firefox     # run only Firefox
#
# Prerequisites:
#   - Connected to the VPN (so the .internal URLs resolve)
#   - Logged in to the Azure CLI:  `az login`

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration (mirrors Jenkinsfile_nightly + charts/ccpay-bubble-frontend/values.yaml)
# ---------------------------------------------------------------------------
ENVIRONMENT="aat"
VAULT="ccpay-${ENVIRONMENT}"                              # = ccpay-aat

# test.url is derived from the ingressHost in charts/ccpay-bubble-frontend/values.yaml
#   nodejs.ingressHost: paybubble.{{ .Values.global.environment }}.platform.hmcts.net
TEST_URL="https://paybubble.${ENVIRONMENT}.platform.hmcts.net"

# From charts/ccpay-bubble-frontend/values.yaml `environment` block
IDAM_API_URL="https://idam-api.${ENVIRONMENT}.platform.hmcts.net"
CCD_DATA_STORE_API_URL="http://ccd-data-store-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
S2S_RPE_SERVICE_AUTH_API_URL="http://rpe-service-auth-provider-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
PAYMENT_API_URL="http://payment-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
REFUNDS_API_URL="http://ccpay-refunds-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
BULKSCANNING_API_URL="http://ccpay-bulkscanning-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
FEES_REGISTER_API_URL="http://fees-register-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"

export TEST_URL
export IDAM_API_URL
export CCD_DATA_STORE_API_URL
export S2S_RPE_SERVICE_AUTH_API_URL
export PAYMENT_API_URL
export REFUNDS_API_URL
export BULKSCANNING_API_URL
export FEES_REGISTER_API_URL

# Runtime / test metadata used by tests/config/CCPBConfig.js
export RUNNING_ENV="${ENVIRONMENT}"
export IDAM_ENV="${ENVIRONMENT}"
export NIGHTLY_TEST="true"

usage() {
    sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
}

CONFIG="acceptance-tests/crossbrowser.conf.js"

GREP=""
SHOW=""
DEBUG=""
BROWSER_FLAG=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            usage
            exit 0
            ;;
        --grep|-g)
            if [[ -z "${2:-}" ]]; then
                echo "ERROR: --grep requires a value (tag or scenario name)." >&2
                exit 1
            fi
            GREP="$2"
            shift 2
            ;;
        --show)
            SHOW="true"
            sed -i 's/show: false/show: true/' "$CONFIG" 2>/dev/null || sed -i '' 's/show: false/show: true/' "$CONFIG" 2>/dev/null
            shift
            ;;
        --debug)
            DEBUG="--debug"
            shift
            ;;
        --browser)
            if [[ -z "${2:-}" ]]; then
                echo "ERROR: --browser requires a value (chromium, firefox, or webkit)." >&2
                exit 1
            fi
            BROWSER_FLAG="$2"
            shift 2
            ;;
        -*)
            echo "ERROR: Unknown option: $1" >&2
            usage >&2
            exit 1
            ;;
        *)
            ENVIRONMENT="$1"
            shift
            ;;
    esac
done

VAULT="ccpay-${ENVIRONMENT}"

# ---------------------------------------------------------------------------
# Azure check
# ---------------------------------------------------------------------------
az account show >/dev/null 2>&1 || {
    echo "ERROR: Not logged into Azure. Run 'az login' (and connect to the VPN) first." >&2
    exit 1
}

# ---------------------------------------------------------------------------
# VPN/DNS check - verify internal URLs resolve
# ---------------------------------------------------------------------------
for url in idam-api.aat.platform.hmcts.net ccd-data-store-api-aat.service.core-compute-aat.internal; do
    if ! curl -sk "https://${url}/health" >/dev/null 2>&1; then
        echo "ERROR: Could not reach '${url}'. Ensure the VPN is connected." >&2
        exit 1
    fi
done

# ---------------------------------------------------------------------------
# Secret helpers - pull a secret from the vault into stdout, never to a file
# ---------------------------------------------------------------------------
vault_secret() {
    az keyvault secret show \
        --vault-name "$1" \
        --name "$2" \
        --query value \
        --output tsv 2>/dev/null
}

require() {
    # require <envVarName> <vaultName> <secretName>
    local env_name="$1" value
    value="$(vault_secret "$2" "$3")"
    if [ -z "$value" ]; then
        echo "WARNING: could not fetch '$3' from vault '$2' (env $1 left unset)" >&2
        return 0
    fi
    export "$env_name=$value"
}

# ---------------------------------------------------------------------------
# Load secrets from Key Vault (from the `secrets` block in Jenkinsfile_nightly)
# ---------------------------------------------------------------------------
require PROBATE_CASE_WORKER_USER_NAME         "${VAULT}" probate-caseworker-username
require PROBATE_CASE_WORKER_PASSWORD         "${VAULT}" probate-caseworker-password
require DIVORCE_CASE_WORKER_USER_NAME         "${VAULT}" divorce-caseworker-username
require DIVORCE_CASE_WORKER_PASSWORD         "${VAULT}" divorce-caseworker-password
require REFUNDS_REQUESTOR_USER_NAME           "${VAULT}" refunds-requestor-caseworker-username
require REFUNDS_REQUESTOR_PASSWORD           "${VAULT}" refunds-requestor-caseworker-password
require REFUNDS_APPROVER_USER_NAME           "${VAULT}" refunds-approver-caseworker-username
require REFUNDS_APPROVER_PASSWORD           "${VAULT}" refunds-approver-caseworker-password
require FEES_REGISTER_EDITOR_USER_NAME        "${VAULT}" freg-editor-username
require FEES_REGISTER_EDITOR_PASSWORD        "${VAULT}" freg-editor-password
require FEES_REGISTER_APPROVER_USER_NAME     "${VAULT}" freg-approver-username
require FEES_REGISTER_APPROVER_PASSWORD     "${VAULT}" freg-approver-password
require FEES_REGISTER_ADMIN_USER_NAME        "${VAULT}" freg-admin-username
require FEES_REGISTER_ADMIN_PASSWORD        "${VAULT}" freg-admin-password
require DIVORCE_CLIENT_ID                    "${VAULT}" fee-pay-divorce-client-id
require DIVORCE_CLIENT_SECRET                "${VAULT}" fee-pay-divorce-client-secret
require DIVORCE_CLIENT_REDIRECT_URI          "${VAULT}" fee-pay-divorce-client-redirect-url
require OAUTH2_CLIENT_SECRET                 "${VAULT}" citizen-oauth-client-secret
require CMC_S2S_SERVICE_SECRET               "${VAULT}" cmc-service-secret
require NOTIFY_EMAIL_API_KEY                 "${VAULT}" notifications-email-apikey
require PAYBUBBLE_S2S_TOTP_SECRET            "${VAULT}" paybubble-s2s-secret
require IDAM_CLIENT_SECRET                   "${VAULT}" paybubble-idam-client-secret
require LD_CLIENT_ID                         "${VAULT}" launch-darkly-client-id
require APPINSIGHTS_CONNECTION_STRING        "${VAULT}" app-insights-connection-string

# Sanity check the secrets the tests need most
for env_var in PROBATE_CASE_WORKER_USER_NAME PROBATE_CASE_WORKER_PASSWORD \
                REFUNDS_APPROVER_USER_NAME REFUNDS_APPROVER_PASSWORD \
                OAUTH2_CLIENT_SECRET CMC_S2S_SERVICE_SECRET; do
    if [ -z "${!env_var:-}" ]; then
        echo "ERROR: required secret '$env_var' is empty - cannot run cross-browser tests." >&2
        exit 1
    fi
done

# ---------------------------------------------------------------------------
# Install Playwright browsers
# ---------------------------------------------------------------------------
echo "Installing Playwright browsers..."
npx playwright install --with-deps

# ---------------------------------------------------------------------------
# Run the cross-browser tests
# ---------------------------------------------------------------------------

# Build common arguments for codeceptjs
CODECEPT_ARGS=("--config" "$CONFIG")
if [ -n "$DEBUG" ]; then
    CODECEPT_ARGS+=("$DEBUG")
fi
if [ -n "$GREP" ]; then
    CODECEPT_ARGS+=("--fgrep" "$GREP")
else
    CODECEPT_ARGS+=("--fgrep" "@crossbrowser")
fi

# Run each browser (chromium, firefox, webkit) sequentially
if [ -n "$BROWSER_FLAG" ]; then
    BROWSERS=("$BROWSER_FLAG")
else
    BROWSERS=(chromium firefox webkit)
fi
for BROWSER in "${BROWSERS[@]}"; do
    echo ""
    echo "============================================================"
    echo "Running cross-browser tests for: ${BROWSER}"
    echo "Environment : ${ENVIRONMENT}"
    echo "Test URL    : ${TEST_URL}"
    echo "Grep filter : ${GREP:-@crossbrowser}"
    echo "Show browser: ${SHOW:+yes}"
    echo "============================================================"

    export NODE_TLS_REJECT_UNAUTHORIZED=0
    CMD=(npx codeceptjs run-multiple "${BROWSER}" "${CODECEPT_ARGS[@]}")
    "${CMD[@]}"
    unset NODE_TLS_REJECT_UNAUTHORIZED
done

# Generate the cross-browser report
echo ""
echo "============================================================"
echo "Generating cross-browser test report..."
echo "============================================================"
npx allure generate functional-output/cross-browser/reports/* -c -o functional-output/cross-browser/allure
