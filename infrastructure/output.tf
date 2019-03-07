output "vaultUri" {
  value = "${data.azurerm_key_vault.paybubble_key_vault.vault_uri}"
}

output "vaultName" {
  value = "${local.vaultName}"
}
