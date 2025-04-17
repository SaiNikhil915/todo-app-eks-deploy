module "vpc" {
  source              = "./modules/vpc"
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  region              = var.region
  name_prefix         = var.project_name
}

module "eks" {
  source = "./modules/eks"

  cluster_name         = var.cluster_name
  vpc_id               = module.vpc.vpc_id
  public_subnet_ids    = module.vpc.public_subnet_ids

  default_instance_type   = var.default_instance_type
  default_desired_capacity = var.default_desired_capacity
  default_max_capacity     = var.default_max_capacity
  default_min_capacity     = var.default_min_capacity

  app_instance_type   = var.app_instance_type
  app_desired_capacity = var.app_desired_capacity
  app_max_capacity     = var.app_max_capacity
  app_min_capacity     = var.app_min_capacity
}

module "ecr" {
  source = "./modules/ecr"
  name   = var.ecr_repo_name
}

module "iam" {
  source = "./modules/iam"
  artifact_bucket_arns = [
  module.s3.bucket_arn,
  "${module.s3.bucket_arn}/*"
]
}
module "s3" {
  source      = "./modules/s3"
  bucket_name = "todo-app-pipeline-artifacts"
}

module "codebuild" {
  source       = "./modules/codebuild"
  project_name = "todo-app-codebuild"
  service_role = module.iam.codebuild_role_arn
  repo_uri     = module.ecr.repository_url
  github_owner = var.github_owner
  github_repo  = var.github_repo
  github_branch = var.github_branch
}

module "codepipeline" {
  source                 = "./modules/codepipeline"
  pipeline_name          = "todo-codepipeline"
  role_arn               = module.iam.codepipeline_role_arn
  artifact_store         = module.s3.bucket_name
  github_owner           = var.github_owner
  github_repo            = var.github_repo
  github_branch          = var.github_branch
  oauth_token            = var.github_oauth_token
  codebuild_project_name = module.codebuild.project_name
}


