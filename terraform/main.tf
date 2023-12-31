terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.81.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }

  }
}

provider "azurerm" {
  features {}
}


resource "azurerm_resource_group" "rg" {
  name     = "uol_feps_soc_comp3211_cwk_sc21lty"
  location = var.resource_group_location
}

resource "random_string" "storage_account_name" {
  length  = 16
  upper   = false
  special = false
}


resource "azurerm_storage_account" "storage_account" {
  name                = random_string.storage_account_name.id
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  account_tier             = "Standard"
  account_replication_type = "LRS"
}


resource "azurerm_service_plan" "service_plan" {
  name                = "service-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  os_type  = "Linux"
  sku_name = "Y1"
}

resource "random_pet" "serverless_name" {
  prefix = "serverless"
}

resource "random_pet" "sql_server_name" {
  prefix = "sql"
}

resource "random_password" "admin_password" {
  count       = 1
  length      = 20
  special     = true
  min_numeric = 1
  min_upper   = 1
  min_lower   = 1
  min_special = 1
}

locals {
  admin_password = try(random_password.admin_password[0].result, var.admin_password)
}

resource "azurerm_mssql_server" "db_server" {
  name                         = random_pet.sql_server_name.id
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  administrator_login          = var.admin_username
  administrator_login_password = local.admin_password
  version                      = "12.0"
}

resource "azurerm_mssql_database" "db" {
  name      = var.sql_db_name
  server_id = azurerm_mssql_server.db_server.id
}

resource "azurerm_linux_function_app" "serverless_app" {
  name                = random_pet.serverless_name.id
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  service_plan_id            = azurerm_service_plan.service_plan.id
  storage_account_name       = azurerm_storage_account.storage_account.name
  storage_account_access_key = azurerm_storage_account.storage_account.primary_access_key


  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME" = "node",
    "SqlConnectionString" = "Server=tcp:${azurerm_mssql_server.db_server.name}.database.windows.net,1433;Initial Catalog=db;Persist Security Info=False;User ID=${var.admin_username};Password=${local.admin_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
  }

  site_config {
    application_stack {
      node_version = 18
    }
  }
}