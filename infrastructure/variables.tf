variable "product" {
  type    = string
}

variable "env" {
  type = string
}

variable "common_tags" {
  type = map(string)
}

variable "shared_product_name" {
    default = "ccpay"
}

variable "location" {
  default = "UK South"
}