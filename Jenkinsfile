pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'front_ressource:latest'
        CONTAINER_NAME = 'front_ressource-container'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Stop and remove the existing container if it exists
                    sh 'docker rm -f ${CONTAINER_NAME} || true'
                    // Run the container with environment variables for PostgreSQL
                    sh '''
                    docker run -d --name ${CONTAINER_NAME} --restart always -p 9094:9094 ${DOCKER_IMAGE}
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}