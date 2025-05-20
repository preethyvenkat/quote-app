pipeline {
  agent any

  environment {
    AWS_REGION = "us-east-1"
    ECR_REPO = "141409473062.dkr.ecr.us-east-1.amazonaws.com/quote-app"
    IMAGE_TAG = "v${BUILD_NUMBER}"
    MANIFEST_REPO = "git@github.com:preethyvenkat/quote-app.git"
  }

  stages {

    stage('Build Docker Image') {
      steps {
        sh '''
          echo "Building Docker image: $ECR_REPO:$IMAGE_TAG"
          docker build -t $ECR_REPO:$IMAGE_TAG .
        '''
      }
    }
    stage('Login to Amazon ECR') {
  	steps {
    	  withCredentials([
           usernamePassword(
            credentialsId: 'aws-creds',  // your Jenkins AWS creds ID
            usernameVariable: 'AWS_ACCESS_KEY_ID',
            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
           )
          ]) {
          sh '''
            mkdir -p ~/.aws
            echo "[default]" > ~/.aws/credentials
            echo "aws_access_key_id=$AWS_ACCESS_KEY_ID" >> ~/.aws/credentials
            echo "aws_secret_access_key=$AWS_SECRET_ACCESS_KEY" >> ~/.aws/credentials
            echo "[default]" > ~/.aws/config
            echo "region=us-east-1" >> ~/.aws/config

            aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 141409473062.dkr.ecr.us-east-1.amazonaws.com
      '''
          }
        }
    }

    stage('Push Docker Image to ECR') {
      steps {
        sh 'docker push $ECR_REPO:$IMAGE_TAG'
      }
    }

    stage('Update Kubernetes Manifest in GitOps Repo') {
      steps {
        sshagent (credentials: ['github-creds']) {
          sh '''
            set -e
            rm -rf manifests
            git clone $MANIFEST_REPO manifests
            cd manifests
            git pull --rebase origin main

            sed -i "s|image: .*|image: $ECR_REPO:$IMAGE_TAG|" deployment.yaml

            git config user.email "preevenkat@gmail.com"
            git config user.name "Preethy Venkat"

            if git diff --quiet; then
              echo "No changes to commit"
            else
              git add deployment.yaml
              git commit -m "Update image to $IMAGE_TAG"
              git push origin main
            fi
          '''
        }
      }
    }
  }
}
