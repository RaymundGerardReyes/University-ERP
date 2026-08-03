terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  # API token provided via CLOUDFLARE_API_TOKEN env var
}

data "cloudflare_zone" "university_erp" {
  name = "university.edu"
}

variable "tunnel_id" {
  type        = string
  description = "The ID of the Cloudflare Zero Trust Tunnel"
}

locals {
  tunnel_cname = "${var.tunnel_id}.cfargotunnel.com"
  subdomains = [
    "student",
    "faculty",
    "admin",
    "finance",
    "library",
    "governance",
    "lms",
    "portal",
    "auth",
    "api",
    "platform",
    "applicant"
  ]
}

resource "cloudflare_record" "tunnel_cnames" {
  for_each = toset(local.subdomains)

  zone_id = data.cloudflare_zone.university_erp.id
  name    = each.key
  value   = local.tunnel_cname
  type    = "CNAME"
  proxied = true
}
