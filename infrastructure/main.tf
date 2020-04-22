provider "azurerm" {
  version = "1.19.0"
}

locals {
  aseName = "core-compute-${var.env}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "${var.core_product}-aat"
  nonPreviewVaultName = "${var.core_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"

  s2sUrl = "http://rpe-service-auth-provider-${local.local_env}.service.${local.local_ase}.internal"

  asp_name = "${var.core_product}-${var.env}"
}

data "azurerm_key_vault" "paybubble_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${var.core_product}-${local.local_env}"
}

data "azurerm_key_vault_secret" "paybubble_idam_client_secret" {
  name = "paybubble-idam-client-secret"
  vault_uri = "${data.azurerm_key_vault.paybubble_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "s2s_key" {
  name      = "microservicekey-ccpay-bubble"
  vault_uri = "https://s2s-${var.env}.vault.azure.net/"
}

data "azurerm_key_vault_secret" "appinsights_instrumentation_key" {
  name = "AppInsightsInstrumentationKey"
  vault_uri = "${data.azurerm_key_vault.paybubble_key_vault.vault_uri}"
}

module "ccpay-bubble" {
  source   = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product  = "${var.product}-${var.component}"
  location = "${var.location}"
  env      = "${var.env}"
  ilbIp    = "${var.ilbIp}"
  subscription = "${var.subscription}"
  is_frontend = "${var.is_frontend}"
  appinsights_instrumentation_key = "${data.azurerm_key_vault_secret.appinsights_instrumentation_key.value}"
  additional_host_name = "${var.env != "preview" ? var.external_host_name : "null"}"
  https_only = "true"
  capacity = "${var.capacity}"
  common_tags     = "${var.common_tags}"
  asp_name = "${local.asp_name}"
  asp_rg = "${local.asp_name}"

  app_settings = {
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_LOGIN_URL: "${var.authentication_web_url}/o/authorize"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_CLIENT_SECRET = "${data.azurerm_key_vault_secret.paybubble_idam_client_secret.value}"
    CCPAY_BUBBLE_URL = "http://ccpay-bubble-frontend-${var.env}.service.core-compute-${var.env}.internal/"
    CCPAY_BUBBLE_MICROSERVICE = "ccpay_bubble"
    PAYHUB_API_URL = "http://payment-api-${var.env}.service.core-compute-${var.env}.internal"
    FEE_REGISTRATION_URL = "http://fees-register-api-${local.local_env}.service.${local.local_ase}.internal/fees-register/fees"
    FEE_JURISDICTION_URL = "http://fees-register-api-${local.local_env}.service.${local.local_ase}.internal/jurisdictions"

    S2S_KEY = "${data.azurerm_key_vault_secret.s2s_key.value}"
    S2S_URL = "${local.s2sUrl}"

    NODE_ENV = "production"
    # temporary variable to ignore certs loading in start.js as it's handled at IIS server level
    IGNORE_CERTS = "true"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    CCD_URL = "${var.ccd_api_url}"

    //added attribute for bulkscan
    CCPAY_BULKSCAN_API_URL = "http://ccpay-bulkscanning-api-pr-195.service.core-compute-preview.internal"
    
    WEBSITE_NODE_DEFAULT_VERSION = "12.15.0"  
  }
}
