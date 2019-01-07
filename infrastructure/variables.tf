variable "product" {
  type = "string"
  default = "ccpay-bubble"
}

variable "location" {
  type    = "string"
  default = "UK South"
}

variable "microservice" {
  type = "string"
  default = "ccpay-bubble"
}

variable "env" {}

variable "subscription" {}

variable "ilbIp"{}

variable "tenant_id" {}

variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "node_environment" {
  default = "sandbox"
}

variable "external_host_name" {
  default = "ccpay-bubble.platform.hmcts.net"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default = ""
}

variable "capacity" {
  default = "1"
}

variable "common_tags" {
  type = "map"
}

variable "core_product" {
  type    = "string"
  default = "ccpay"
}

