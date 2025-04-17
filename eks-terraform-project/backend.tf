terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket2222"  # Your created S3 bucket
    key            = "terraform.tfstate"               # Path within the bucket
    region         = "us-east-1"                        # Your region
    encrypt        = true                               # Encrypt the state file
    dynamodb_table = "terraform-lock"                   # DynamoDB table for state locking
  }
}