# ================= Outputs =================
output "ecr_repo_url" {
  value       = module.ecr.repository_url
  description = "ECR repository URL for Docker images"
}

output "codebuild_role" {
  value       = module.iam.codebuild_role_arn
  description = "IAM role ARN for CodeBuild"
}

output "codepipeline_role" {
  value       = module.iam.codepipeline_role_arn
  description = "IAM role ARN for CodePipeline"
}
