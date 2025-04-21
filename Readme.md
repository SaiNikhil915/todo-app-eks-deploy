# Todo Application on AWS EKS with CI/CD Pipeline

## 📌 Project Overview
This project demonstrates the deployment of a **full-stack Todo application** using the following technologies:
- **Docker** for containerization
- **Kubernetes** (EKS) for orchestration
- **Terraform** for infrastructure provisioning
- **AWS CodePipeline & CodeBuild** for CI/CD
- **Amazon ECR** to store Docker images

The project automates the entire process from pushing code to GitHub to deploying the application on a live EKS cluster with a LoadBalancer.

---

## 🛠️ Tech Stack
- **Frontend**: React (basic UI for Todo app)
- **Backend**: Node.js/Express (handles todo operations)
- **Database**: MongoDB (Atlas or self-hosted)
- **Infrastructure**: AWS (EKS, ECR, VPC, Subnets, etc.)
- **CI/CD**: AWS CodePipeline, CodeBuild
- **IaC**: Terraform

---

## 📁 Project Structure
```
├── backend/                  # Node.js backend for todo app
│   ├── Dockerfile            # Dockerfile for backend
├── frontend/                # React frontend (if included)
├── k8s/                      # Kubernetes manifests
│   ├── deployment.yaml       # Deployment configuration
│   └── service.yaml          # LoadBalancer service
├── buildspec.yml             # CodeBuild build instructions
├── eks-terraform-project/    # Terraform modules and configs
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── docker-compose.yml        # For local development/testing
├── Dockerfile                # Dockerfile at root (optional)
```

---

## 🚀 Workflow Overview
1. Developer pushes code to GitHub.
2. CodePipeline triggers CodeBuild.
3. CodeBuild builds and pushes Docker image to ECR.
4. Kubernetes deployment file is updated with the new image.
5. Resources are deployed to EKS.
6. LoadBalancer exposes the application via a public URL.

---

## ⚙️ Setup Instructions

### 🔐 Prerequisites
- AWS account
- IAM user with EKS, EC2, VPC, ECR, S3 permissions
- Terraform, Docker, kubectl, and AWS CLI installed
- GitHub repo connected to CodePipeline

---

### 🌐 Step 1: Infrastructure Provisioning with Terraform
```bash
cd eks-terraform-project/
terraform init
terraform plan
terraform apply
```
This provisions:
- VPC, subnets, route tables
- EKS Cluster
- IAM roles and policies
- ECR repository

---

### 🐳 Step 2: Build and Push Docker Image (Manual/Optional)
If you want to manually build and push:
```bash
docker build -t <your-ecr-url>/todo-app-repo:latest .
docker push <your-ecr-url>/todo-app-repo:latest
```

---

### ⚙️ Step 3: CI/CD with CodePipeline
Ensure CodePipeline is configured with:
- Source: GitHub
- Build: CodeBuild project (uses `buildspec.yml`)

**buildspec.yml** handles:
- Docker build
- Push to ECR
- Generate `imagedefinitions.json`
- Update Kubernetes deployment manifest
- Deploy using `kubectl`

CodeBuild script logs into ECR, builds image, pushes it, renders `deployment.yaml` with actual image URL, and deploys it with `kubectl`.

---

## 🌐 Accessing the Application
To get the **external LoadBalancer URL**:
```bash
kubectl get svc f2p-backend
```
Look for the `EXTERNAL-IP`:
```
NAME          TYPE           CLUSTER-IP      EXTERNAL-IP                       PORT(S)
f2p-backend   LoadBalancer   10.100.30.167   a1b2c3d4e5.elb.amazonaws.com     80:30822/TCP
```
Access the application: [http://EXTERNAL-IP](http://EXTERNAL-IP)

---

## 🧰 Troubleshooting Commands
- Update kubeconfig:
  ```bash
  aws eks update-kubeconfig --region us-east-1 --name todo-eks-cluster
  ```
- Check pod logs:
  ```bash
  kubectl logs -l app=f2p-backend
  ```
- Describe service or pod:
  ```bash
  kubectl describe svc f2p-backend
  kubectl describe pod <pod-name>
  ```
- Delete and redeploy:
  ```bash
  kubectl delete -f k8s/rendered-deployment.yaml
  kubectl apply -f k8s/rendered-deployment.yaml
  ```

---

## 🧹 Cleanup Resources
To destroy infrastructure:
```bash
cd eks-terraform-project/
terraform destroy
```
If stuck:
- Manually delete LoadBalancers, EKS Cluster, NAT Gateway, Internet Gateway, and Subnets via AWS Console.
- Then re-run `terraform destroy`

To avoid AWS billing, delete unused ECR repos and orphaned Elastic IPs.

---

## ✅ Conclusion
You now have a fully functional **Todo Application** deployed via a **complete CI/CD pipeline** using **AWS EKS**, **CodePipeline**, and **Terraform**.

For issues, refer to the troubleshooting section or AWS console logs. Happy building! 🚀

