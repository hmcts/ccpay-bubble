#!/usr/bin/env bash
#
# Run the ccpay-bubble E2E functional tests (CodeceptJS) against a deployed
# AAT or DEMO environment.
#
# Environment variables and secrets are sourced from the Jenkinsfile_CNP
# pipeline. Secret VALUES are fetched from Azure Key Vault at runtime and never
# persisted or committed - only the vault/secret names and target env var
# names live in this file. Non-secret API URLs come from
# charts/ccpay-bubble-frontend/values.yaml.
#
# Usage:
#   ./scripts/run-functional-tests.sh                   # run all functional tests against aat
#   ./scripts/run-functional-tests.sh -e demo           # run all functional tests against demo
#   ./scripts/run-functional-tests.sh CCPB_Probate      # run a single test (file name or grep)
#   ./scripts/run-functional-tests.sh -e demo CCPB_Probate
#
# The environment can also be set with the ENVIRONMENT env var:
#   ENVIRONMENT=demo ./scripts/run-functional-tests.sh
#
# Prerequisites:
#   - Connected to the HMCTS VPN (so the internal .internal URLs resolve)
#   - Logged in to the Azure CLI:  `az login`
#   - yarn install has been run (node_modules present)

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration (mirrors Jenkinsfile_CNP + charts/ccpay-bubble-frontend/values.yaml)
# ---------------------------------------------------------------------------
ENVIRONMENT="${ENVIRONMENT:-aat}"
COMMAND="all"   # or "single"

# test.url (frontendUrl) is derived from the ingressHost in
# charts/ccpay-bubble-frontend/values.yaml
#   nodejs.ingressHost: paybubble.{{ .Values.global.environment }}.platform.hmcts.net
TEST_URL="https://paybubble.${ENVIRONMENT}.platform.hmcts.net"

# Non-secret URLs from charts/ccpay-bubble-frontend/values.yaml (environment
# block). The tests read these via acceptance-tests/test/end-to-end/tests/config/CCPBConfig.js
# and config/custom-environment-variables.yaml.
IDAM_API_URL="https://idam-api.${ENVIRONMENT}.platform.hmcts.net"
IDAM_AUTHENTICATION_WEB_URL="https://idam-web-public.${ENVIRONMENT}.platform.hmcts.net/login"
PAYHUB_API_URL="http://payment-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
CCPAY_BULKSCAN_API_URL="http://ccpay-bulkscanning-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
CCPAY_REFUNDS_API_URL="http://ccpay-refunds-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
S2S_RPE_SERVICE_AUTH_API_URL="http://rpe-service-auth-provider-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"
FEE_REGISTRATION_URL="http://fees-register-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal/fees-register/fees"
FEE_JURISDICTION_URL="http://fees-register-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal/jurisdictions"
CCD_URL="http://ccd-data-store-api-${ENVIRONMENT}.service.core-compute-${ENVIRONMENT}.internal"

export TEST_URL
export IDAM_API_URL
export IDAM_AUTHENTICATION_WEB_URL
# Export both app-config and acceptance-helper names.
export PAYHUB_API_URL
export PAYMENT_API_URL="${PAYHUB_API_URL}"
export CCPAY_BULKSCAN_API_URL
export BULKSCANNING_API_URL="${CCPAY_BULKSCAN_API_URL}"
export CCPAY_REFUNDS_API_URL
export REFUNDS_API_URL="${CCPAY_REFUNDS_API_URL}"
export S2S_RPE_SERVICE_AUTH_API_URL
export FEES_REGISTER_API_URL="${FEE_REGISTRATION_URL%/fees-register/fees}"
export CCD_DATA_STORE_API_URL="${CCD_URL}"
export E2E_TESTS_FOR_ACCESSIBILITY="true"

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
usage() {
    sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            SINGLE_TEST="$1"
            COMMAND="single"
            shift
            ;;
    esac
done

if [[ "$ENVIRONMENT" != "aat" && "$ENVIRONMENT" != "demo" ]]; then
    echo "ERROR: unsupported environment '$ENVIRONMENT'. Use 'aat' or 'demo'." >&2
    exit 1
fi

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
require PROBATE_CASE_WORKER_USER_NAME      "${VAULT}" probate-caseworker-username
require PROBATE_CASE_WORKER_PASSWORD      "${VAULT}" probate-caseworker-password
require DIVORCE_CASE_WORKER_USER_NAME      "${VAULT}" divorce-caseworker-username
require DIVORCE_CASE_WORKER_PASSWORD      "${VAULT}" divorce-caseworker-password
require REFUNDS_REQUESTOR_USER_NAME      "${VAULT}" refunds-requestor-caseworker-username
require REFUNDS_REQUESTOR_PASSWORD      "${VAULT}" refunds-requestor-caseworker-password
require REFUNDS_APPROVER_USER_NAME      "${VAULT}" refunds-approver-caseworker-username
require REFUNDS_APPROVER_PASSWORD      "${VAULT}" refunds-approver-caseworker-password
require FEES_REGISTER_EDITOR_USER_NAME  "${VAULT}" freg-editor-username
require FEES_REGISTER_EDITOR_PASSWORD  "${VAULT}" freg-editor-password
require FEES_REGISTER_APPROVER_USER_NAME "${VAULT}" freg-approver-username
require FEES_REGISTER_APPROVER_PASSWORD "${VAULT}" freg-approver-password
require FEES_REGISTER_ADMIN_USER_NAME   "${VAULT}" freg-admin-username
require FEES_REGISTER_ADMIN_PASSWORD   "${VAULT}" freg-admin-password
require DIVORCE_CLIENT_ID               "${VAULT}" fee-pay-divorce-client-id
require DIVORCE_CLIENT_SECRET           "${VAULT}" fee-pay-divorce-client-secret
require DIVORCE_CLIENT_REDIRECT_URI     "${VAULT}" fee-pay-divorce-client-redirect-url
require OAUTH2_CLIENT_SECRET            "${VAULT}" citizen-oauth-client-secret
require CMC_S2S_SERVICE_SECRET          "${VAULT}" cmc-service-secret
require NOTIFY_EMAIL_API_KEY            "${VAULT}" notifications-email-apikey
require IDAM_CLIENT_SECRET              "${VAULT}" paybubble-idam-client-secret

# Sanity check the secrets the tests need most
for env_var in OAUTH2_CLIENT_SECRET CMC_S2S_SERVICE_SECRET PROBATE_CASE_WORKER_PASSWORD DIVORCE_CASE_WORKER_PASSWORD; do
    if [ -z "${!env_var:-}" ]; then
        echo "ERROR: required secret '$env_var' is empty - cannot run functional tests." >&2
        exit 1
    fi
done

# ---------------------------------------------------------------------------
# Resolve a single test argument to a concrete test file.
#
# CodeceptJS v3.7.5 does not discover tests from the config `tests` glob when
# `--grep` is supplied on its own ("No tests found by pattern"). It DOES load
# tests reliably when a concrete file path is given, and `--grep` then narrows
# within that file. So we map the argument to a file first.
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Resolve a single test argument to a concrete test file.
#
# CodeceptJS v3.7.5 does not discover tests from the config `tests` glob when
# `--grep` is supplied on its own ("No tests found by pattern"). It DOES load
# tests reliably when a concrete file path is given, and `--grep` then narrows
# within that file. So we map the argument to a file first.
#
# IMPORTANT: the path passed to codeceptjs must be relative to the config's
# test root ("Using test root .../acceptance-tests"), i.e. files are given as
# "test/end-to-end/tests/...", NOT "acceptance-tests/test/...".
# ---------------------------------------------------------------------------
TESTS_DIR="acceptance-tests/test/end-to-end/tests"
CODE_TESTS_DIR="test/end-to-end/tests"
TAG_MODE=0

resolve_test_file() {
    local target="$1" f base
    FILE_MODE=0
    # 1) The argument is already a path to a test file.
    if [ -f "$TESTS_DIR/$target" ]; then
        FILE_MODE=1
        echo "$CODE_TESTS_DIR/$target"
        return 0
    fi
    if [ -f "$target" ]; then
        # Normalise a repo-relative path to one relative to the test root.
        FILE_MODE=1
        echo "${target#acceptance-tests/}"
        return 0
    fi
    # 2) The argument matches a test file basename (with or without .js).
    base="${target%.js}"
    for f in "$TESTS_DIR"/*.js "$TESTS_DIR"/*_test.js; do
        [ -f "$f" ] || continue
        if [ "${f##*/}" = "$base" ]; then
            FILE_MODE=1
            echo "$CODE_TESTS_DIR/${f##*/}"
            return 0
        fi
    done
    # 3) The argument is a scenario name contained in a test file's source.
    for f in "$TESTS_DIR"/*_test.js; do
        [ -f "$f" ] || continue
        if grep -q "$target" "$f"; then
            echo "$CODE_TESTS_DIR/${f##*/}"
            return 0
        fi
    done
    return 1
}

# ---------------------------------------------------------------------------
# Run the tests
# ---------------------------------------------------------------------------
if [ "$COMMAND" = "single" ]; then
    if [[ "$SINGLE_TEST" == @* ]]; then
        TAG_MODE=1
    fi

    if [ "$TAG_MODE" = "1" ]; then
        echo "Running functional tests by tag: $SINGLE_TEST (environment: $ENVIRONMENT)"
        yarn playwright install
        codeceptjs run --config acceptance-tests/codecept.conf.js --grep "$SINGLE_TEST"
        exit 0
    fi

    FILE_MODE=0
    if ! TEST_FILE="$(resolve_test_file "$SINGLE_TEST")"; then
        echo "ERROR: could not find a functional test matching '$SINGLE_TEST'." >&2
        echo "       Use a test file name (e.g. CCPB_Probate) or a scenario name." >&2
        exit 1
    fi
    echo "Running functional test: $SINGLE_TEST (file: $TEST_FILE, environment: $ENVIRONMENT)"
    yarn playwright install
    if [ "$FILE_MODE" = "1" ]; then
        # Argument was a file name - run every scenario in that file.
        codeceptjs run --config acceptance-tests/codecept.conf.js "$TEST_FILE"
    else
        # Argument was a scenario name - narrow within the resolved file.
        codeceptjs run --config acceptance-tests/codecept.conf.js \
            "$TEST_FILE" --grep "$SINGLE_TEST"
    fi
else
    echo "Running all functional tests (environment: $ENVIRONMENT)"
    yarn test:functional
fi
