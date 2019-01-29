#!/bin/bash
set -ex

# Setup required environment variables. TEST_URL should be set by CNP
export E2E_FRONTEND_URL=${TEST_URL}
export E2E_PROXY_SERVER=${E2E_PROXY_SERVER:-"proxyout.reform.hmcts.net:8080"}
export E2E_PROXY_BYPASS=${E2E_PROXY_BYPASS:-"*beta*LB.reform.hmcts.net"}
export E2E_FRONTEND_NODE_ENV=${E2E_FRONTEND_NODE_ENV:-"production"}
export E2E_WAIT_FOR_TIMEOUT_VALUE=${E2E_WAIT_FOR_TIMEOUT_VALUE:-15000}
export E2E_WAIT_FOR_ACTION_VALUE=${E2E_WAIT_FOR_ACTION_VALUE:-250}
export CODECEPT_PARAMS=${CODECEPT_PARAMS:-""}
export E2E_SKIP_FUNCTIONAL_TESTS=${SKIP_FUNCTIONAL_TESTS}

echo "Ski functional tests: $E2E_SKIP_FUNCTIONAL_TESTS"

if [ "$E2E_SKIP_FUNCTIONAL_TESTS" = "true" ]; then
    exit 0
else
    rm -rf acceptance-tests/output
    rm -rf functional-output/
    if yarn test:acceptance; then
        exit 0
    else
        mv acceptance-tests/output/*.png functional-output/
        exit 1
    fi
fi
