variable "cluster_name" {}
variable "vpc_id" {}
variable "public_subnet_ids" {
  type = list(string)
}

# Default Node Group
variable "default_instance_type" {}
variable "default_desired_capacity" {}
variable "default_max_capacity" {}
variable "default_min_capacity" {}

# App Node Group
variable "app_instance_type" {}
variable "app_desired_capacity" {}
variable "app_max_capacity" {}
variable "app_min_capacity" {}
