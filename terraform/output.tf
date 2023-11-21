output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "sql_server_name" {
  value = azurerm_mssql_server.db_server.name
}


output "admin_password" {
  sensitive = true
  value     = local.admin_password
}

output "serverless_name" {
  value       = azurerm_linux_function_app.serverless_app.name
  description = "Serverless function app name"
}

output "serverless_hostname" {
  value       = azurerm_linux_function_app.serverless_app.default_hostname
  description = "Serverless function app hostname"
}
