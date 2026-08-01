# 💳 WalletFlow

<div align="center">

### End-to-End DevOps CI/CD Pipeline for a Three-Tier Expense Management Application

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Orchestration-2496ED?style=for-the-badge&logo=docker)](https://docs.docker.com/compose/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI/CD-D24939?style=for-the-badge&logo=jenkins)](https://www.jenkins.io/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Version_Control-181717?style=for-the-badge&logo=github)](https://github.com/)

</div>

---

# 📌 Overview

WalletFlow is a full-stack three-tier expense management application integrated with an automated DevOps CI/CD pipeline.

The application consists of:

- **React** Frontend
- **Spring Boot** Backend
- **MySQL** Database

The project demonstrates modern DevOps practices by automating build and deployment using **Jenkins**, **Docker**, and **Docker Compose**, while also including **Terraform** configurations for provisioning cloud infrastructure on AWS.

---

# 🏗 Architecture

```text
                    Developer
                        │
                        ▼
                  GitHub Repository
                        │
                        ▼
                  Jenkins Pipeline
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
 Build Docker Images              Verify Build
        │
        ▼
 Docker Compose Deployment
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
React  Spring    MySQL
Frontend Boot    Database
```

---

# 🚀 CI/CD Pipeline

The Jenkins pipeline performs the following stages automatically:

- Clone the GitHub repository
- Checkout latest source code
- Build Docker images
- Stop existing containers
- Deploy application using Docker Compose
- Verify deployment
- Display running containers

---

# ⚙️ Tech Stack

## Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

## Backend

- Spring Boot
- Java 17
- Maven
- REST APIs

## Database

- MySQL 8

## DevOps

- Jenkins
- Docker
- Docker Compose
- Terraform
- AWS
- Git
- GitHub

---

# 📂 Project Structure

```text
WalletFlow
│
├── backend/
│
├── frontend/
│
├── terraform/
│
├── docker-compose.yml
│
├── Jenkinsfile
│
└── README.md
```

---

# 🔄 Jenkins Pipeline

```text
GitHub
   │
   ▼
Clone Repository
   │
   ▼
Build Docker Images
   │
   ▼
Docker Compose Up
   │
   ▼
Deploy Containers
   │
   ▼
Verify Deployment
```

---

# 🐳 Docker Services

The application runs as three Docker containers.

| Service | Description |
|----------|-------------|
| Frontend | React Application |
| Backend | Spring Boot REST API |
| Database | MySQL 8 |

---

# ☁ Infrastructure

Infrastructure provisioning is managed using **Terraform**.

Terraform configuration is included to provision AWS resources required for deployment.

---

# 🛠 Jenkins Automation

The Jenkins pipeline automatically:

- Clones the latest code from GitHub
- Builds Docker images
- Starts application containers
- Verifies successful deployment
- Displays running Docker containers

---

# 📷 Project Screenshots

## Architecture

> Add Architecture Diagram

---

## Jenkins Dashboard

> Add Screenshot

---

## Jenkins Pipeline

> Add Screenshot

---

## Successful Console Output

> Add Screenshot

---

## Docker Containers

> Add Screenshot of `docker ps`

---

## Application

> Add Frontend Screenshot

---

## GitHub Repository

> Add Repository Screenshot

---

# ▶️ Running Locally

Clone the repository

```bash
git clone https://github.com/SumitRaj511/WalletFlow.git
```

Move into the project

```bash
cd WalletFlow
```

Build and start containers

```bash
docker compose up --build -d
```

Stop the application

```bash
docker compose down
```

---

# 📜 License

This project is intended for educational and learning purposes.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

</div>
