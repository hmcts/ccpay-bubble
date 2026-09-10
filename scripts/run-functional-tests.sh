#!/usr/bin/env bash
#
# Run the PayBubble codeceptjs functional tests against a deployed environment
# (AAT by default, configurable to demo, etc.).
#
# Environment variables and secrets are sourced from the Jenkinsfile_CNP pipeline.
# Secret VALUES are fetched from Azure Key Vault at runtime and never persisted or
# committed - only the vault/secret names and target env var names live in this file.
#
# Usage:
#   ./scripts/run-functional-tests.sh                       # all @pipeline tests against AAT
#   ./scripts/run-functional-tests.sh demo                  # all tests against demo
#   ./scripts/run-functional-tests.sh --grep "@serial"      # run a grep/tag filter
#   ./scripts/run-functional-tests.sh demo --grep "Upfront remission added after failed Telephony Payment and allocate bulk scan payment for remaining amount"
#   ./scripts/run-functional-tests.sh --debug --grep "@pipeline"
#
# Prerequisites:
#   - Connected to the VPN (so the .internal URLs resolve)
#   - Logged in to the Azure CLI:  `az login`

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration (mirrors Jenkinsfile_CNP + charts/ccpay-bubble-frontend/values.yaml)
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
CLIENT_REDIRECT_URI="https://cmc-citizen-frontend.service.core-compute-${ENVIRONMENT}.internal/receiver"

export TEST_URL
export IDAM_API_URL
export CCD_DATA_STORE_API_URL
export S2S_RPE_SERVICE_AUTH_API_URL
export PAYMENT_API_URL
export REFUNDS_API_URL
export BULKSCANNING_API_URL
export FEES_REGISTER_API_URL
export CLIENT_REDIRECT_URI

# Runtime / test metadata used by tests/config/CCPBConfig.js
export RUNNING_ENV="${ENVIRONMENT}"
export IDAM_ENV="${ENVIRONMENT}"
export E2E_TESTS_FOR_ACCESSIBILITY="false"

usage() {
    sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
}

GREP=""
DEBUG=""
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
        --debug)
            DEBUG="--debug"
            shift
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
# Load secrets from Key Vault (from the `secrets` block in Jenkinsfile_CNP)
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

# Sanity check the secrets the tests need most
for env_var in PROBATE_CASE_WORKER_USER_NAME PROBATE_CASE_WORKER_PASSWORD \
               REFUNDS_APPROVER_USER_NAME REFUNDS_APPROVER_PASSWORD \
               OAUTH2_CLIENT_SECRET CMC_S2S_SERVICE_SECRET; do
    if [ -z "${!env_var:-}" ]; then
        echo "ERROR: required secret '$env_var' is empty - cannot run functional tests." >&2
        exit 1
    fi
done

# ---------------------------------------------------------------------------
# Run the tests
# ---------------------------------------------------------------------------
CONFIG="acceptance-tests/codecept.conf.js"

# The `tests` glob in codecept.conf.js is './test/end-to-end/tests/*_test.js'.
# codeceptjs's bundled glob v11 does not match a leading './' against the test
# root, so discovery returns nothing. Overriding with a './'-less pattern keeps
# test discovery working on both glob v7 and v11 (the CI build uses the same
# pattern via the npm scripts, so this only hardens the local run).
CMD=(npx codeceptjs run --config "$CONFIG" --override '{"tests":"test/end-to-end/tests/*_test.js"}')
if [ -n "$DEBUG" ]; then
    CMD+=("$DEBUG")
fi
if [ -n "$GREP" ]; then
    CMD+=(--grep "$GREP")
fi

echo "Environment : ${ENVIRONMENT}"
echo "Test URL    : ${TEST_URL}"
echo "Grep filter : ${GREP:-<all @pipeline + @nightly scenarios>}"
echo "Command     : ${CMD[*]}"

"${CMD[@]}"