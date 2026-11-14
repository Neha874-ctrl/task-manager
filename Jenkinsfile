pipeline {
    agent any

    environment {
        APP_NAME     = 'node-task-manager'
        DOCKER_IMAGE = 'node-task-manager'
        // Fallback to '1' if BUILD_NUMBER is undefined in standalone test environments
        IMAGE_TAG    = "${env.BUILD_NUMBER ?: '1'}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "=========================================================="
                echo "Stage 1: Checkout"
                echo "Pulling latest source code from GitHub repository..."
                echo "=========================================================="
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "=========================================================="
                echo "Stage 2: Install Dependencies"
                echo "Running clean dependency installation with npm ci..."
                echo "=========================================================="
                sh 'npm ci'
            }
        }

        stage('Testing') {
            steps {
                echo "=========================================================="
                echo "Stage 3: Testing"
                echo "Executing automated test suite (Unit & Integration tests)..."
                echo "=========================================================="
                // Pipeline fails automatically if any test fails (exit code != 0)
                sh 'npm test'
            }
        }

        stage('Build Application') {
            steps {
                echo "=========================================================="
                echo "Stage 4: Build Application"
                echo "Compiling TypeScript into production JavaScript in dist/..."
                echo "=========================================================="
                sh 'npm run build'

                echo "Verifying compiled build artifacts in dist/ directory..."
                sh '''
                    if [ ! -d "dist" ] || [ ! -f "dist/server.js" ]; then
                        echo "ERROR: Production build failed! 'dist' directory or 'dist/server.js' was not generated."
                        exit 1
                    fi
                    echo "Build verification SUCCESS: dist/ exists and contains compiled files."
                    ls -lah dist/
                '''
            }
        }

        stage('Archive Build') {
            steps {
                echo "=========================================================="
                echo "Stage 5: Archive Build"
                echo "Archiving production dist/ artifacts with fingerprinting..."
                echo "=========================================================="
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }

        stage('Docker Build') {
            steps {
                echo "=========================================================="
                echo "Stage 6: Docker Build"
                echo "Building Docker image ${DOCKER_IMAGE}:${IMAGE_TAG}..."
                echo "=========================================================="
                sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Docker Image Verification') {
            steps {
                echo "=========================================================="
                echo "Stage 7: Docker Image Verification"
                echo "Verifying Docker image existence and inspecting metadata..."
                echo "=========================================================="
                sh """
                    echo "Checking local Docker image list for ${DOCKER_IMAGE}:${IMAGE_TAG}..."
                    docker images --filter "reference=${DOCKER_IMAGE}:${IMAGE_TAG}"

                    echo "Inspecting Docker image configuration..."
                    docker inspect --format 'Image ID: {{.Id}} | OS/Arch: {{.Os}}/{{.Architecture}} | Size: {{.Size}} bytes' ${DOCKER_IMAGE}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "=========================================================="
            echo "SUCCESS: All pipeline stages passed successfully!"
            echo "Artifacts are archived and Docker image ${DOCKER_IMAGE}:${IMAGE_TAG} is ready."
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo "FAILURE: Pipeline execution failed on stage: ${env.STAGE_NAME}."
            echo "Please review the build logs above to diagnose and fix the issue."
            echo "=========================================================="
        }
        always {
            echo "=========================================================="
            echo "Pipeline run completed for build #${env.IMAGE_TAG}."
            echo "=========================================================="
        }
    }
}
