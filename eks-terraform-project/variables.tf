# ================= AWS Basics =================
variable "region" {
  default = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "project_name" {
  description = "Prefix name for resources"
  default     = "todo"
}


# ================= EKS Cluster =================
variable "cluster_name" {
  default = "todo-eks-cluster"
}

# Default node group
variable "default_instance_type" {
  default = "t3.micro"
}
variable "default_desired_capacity" {
  default = 1
}
variable "default_max_capacity" {
  default = 2
}
variable "default_min_capacity" {
  default = 1
}

# Application node group
variable "app_instance_type" {
  default = "t3.small"
}
variable "app_desired_capacity" {
  default = 1
}
variable "app_max_capacity" {
  default = 2
}
variable "app_min_capacity" {
  default = 1
}

# ================= ECR and GitHub =================
variable "ecr_repo_name" {
  default = "todo-app-repo"
}

variable "github_owner" {}
variable "github_repo" {}
variable "github_branch" {
  default = "main"
}
variable "github_oauth_token" {
  sensitive = true
}

