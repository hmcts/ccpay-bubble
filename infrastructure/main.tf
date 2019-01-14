provider "azurerm" {
  version = "1.19.0"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  local_resource_group_name = "${var.env == "prod" ? "payment-api-prod" : "${var.resource_group_name}"}"


  previewVaultName = "${var.product}-aat"
  nonPreviewVaultName = "${var.product}-${var.env}"

  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"

  asp_name = "${var.env == "prod" ? "ccpay-prod" : "ccpay-aat"}"

  rgName= "ccpay-${var.env}"
  vault_rg_name = "${(var.env == "preview" || var.env == "spreview") ? "ccpay-aat" : local.rgName}"
}

/*
data "azurerm_key_vault" "ccpaybubble_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}
*/
module "ccpay-bubble" {
  source   = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product  = "${var.product}"
  location = "${var.location}"
  env      = "${var.env}"
  ilbIp    = "${var.ilbIp}"
  subscription = "${var.subscription}"
  is_frontend = "${var.is_frontend}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  additional_host_name = "${var.env != "preview" ? var.external_host_name : "null"}"
  https_only = "true"
  capacity = "${var.capacity}"
  common_tags     = "${var.common_tags}"
  asp_name = "${local.asp_name}"
  asp_rg = "${local.rgName}"
  resource_group_name = "${local.local_resource_group_name}"

  app_settings = {
    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"
    dummy = "dummy"
  }
}
