locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "${var.product}-aat"
  nonPreviewVaultName = "${var.product}-${var.env}"

  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"
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
  is_frontend = "${var.env != "preview" ? 1: 0}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  additional_host_name = "${var.env != "preview" ? var.external_host_name : "null"}"
  https_only = "true"
  capacity = "${var.capacity}"
  common_tags     = "${var.common_tags}"

  app_settings = {
    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"
  }
}
