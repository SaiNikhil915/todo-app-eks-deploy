module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.8.4"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"
  subnet_ids      = var.public_subnet_ids
  vpc_id          = var.vpc_id

  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  eks_managed_node_groups = {
    default = {
      desired_size   = var.default_desired_capacity
      max_size       = var.default_max_capacity
      min_size       = var.default_min_capacity
      instance_types = [var.default_instance_type]
    }
    app = {
      desired_size   = var.app_desired_capacity
      max_size       = var.app_max_capacity
      min_size       = var.app_min_capacity
      instance_types = [var.app_instance_type]
    }
  }
}
