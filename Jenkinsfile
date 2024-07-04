def registryAuth = 'authHarbor'
def getCurrentTime() {
    return new Date().format("yyyy-MM-dd HH:mm:ss Z", TimeZone.getTimeZone("UTC"))
}
def getChangeAuthorName() {
    return sh(returnStdout: true, script: "git show -s --pretty=%an").trim()
}

pipeline {
    agent {node { label 'master' } } 
    environment {
        // Variable registry images
        DOCKER_REGISTRY = "${env.DOCKER_REGISTRY}"
        // Variable slack alert
        URL_ALERT = "${env.URL_ALERT}"
        SLACK_WEBHOOK = "${env.SLACK_WEBHOOK}"
        SLACK_CHANNEL = "${env.SLACK_CHANNEL}"
        PROJECT_NAME = "${env.JOB_NAME}"
        USERNAME_NOTI = "${env.NAME_NOTI}"
        CHANGE_AUTHOR = getChangeAuthorName()
        // Variable build env
        SERVER1 = "${env.SERVER1}"
        SERVER2 = "${env.SERVER2}"
        PROJECT_URL = "${env.PROJECT_URL}"
        BRANCH = "${env.GIT_BRANCH}"
        DOCKER_BASE = "${env.DOCKER_BASE_URL}"
        CONTAINER_INIT = "${env.CONTAINER_INIT_NAME}"
        CONTAINER_INIT_IMAGE = "${env.CONTAINER_INIT_IMAGE}"
        APP_DEPLOYMENT = "${env.APP_DEPLOYMENT}"
        NAME_SPACE = "${env.NAMESPACE}"
        PATH_KUBECONFIG = "${env.PATH_KUBECONFIG}"
    }

    stages {
        stage ('Post') {
            steps {
                script {
                    def startTime = getCurrentTime()
                    def formattedStartTime = startTime.replaceFirst(/\s\+\d{4}/, "")
                    sh """
                        cd "${URL_ALERT}"
                        python3 slack-alert.py -T STARTED -B "${formattedStartTime}"
                        """
                }
            }
        }

        stage('SCM') {
            steps {
                checkout scm
            }
        }

        // stage('SonarQube Analysis') {
        //     steps {
        //         script {
        //             if (BRANCH == 'origin/master'){
        //                 sh """
        //                     echo "No Sonarqube"
        //                 """                   
        //             }
        //             if (BRANCH == 'origin/staging'){
        //                 sh """
        //                     echo "No Sonarqube"
        //                 """
        //             }
        //             if (BRANCH == 'origin/development'){
        //                 def scannerHome = tool 'sonar-scanner';
        //                 withSonarQubeEnv() {
        //                     sh "${scannerHome}/bin/sonar-scanner"
        //                 }                   
        //             }
        //         }
        //     }
        // }
        stage('Deploy EverFlow') {
            steps {
                script {
                    if (BRANCH == 'origin/master'){
                        sh """
                            rsync -avz --exclude-from='excludes.txt' --delete $WORKSPACE/ root@$SERVER1:$PROJECT_URL
                            ssh root@$SERVER1 'cd $PROJECT_URL && yarn install && yarn build-master && SHOPIFY_CLI_PARTNERS_TOKEN=$SHOPIFY_CLI_PARTNERS_TOKEN yarn deploy-master && pm2 restart all'
                            """   
                    }
                    if (BRANCH == 'origin/staging'){
                        sh """#!/bin/bash
                            sudo rsync -avz --exclude-from='excludes.txt' --delete $WORKSPACE/ $PROJECT_URL
                            docker exec $CONTAINER_INIT_NAME bash -c "yarn install && yarn build-rc && SHOPIFY_CLI_PARTNERS_TOKEN=$SHOPIFY_CLI_PARTNERS_TOKEN yarn deploy-rc"
                            export KUBECONFIG=$PATH_KUBECONFIG
                            kubectl rollout restart deployment $APP_DEPLOYMENT -n $NAME_SPACE
                            """
                    }
                    if (BRANCH == 'origin/development'){
                        withDockerRegistry(credentialsId: "${registryAuth}", url: "${DOCKER_REGISTRY}") {
                            sh """#!/bin/bash
                                rsync -avz --exclude '.env' --exclude '.git' --exclude 'node_modules' --exclude 'dist' --exclude 'config' $WORKSPACE/ $PROJECT_URL
                                cd $DOCKER_BASE
                                docker compose up -d
                                while docker ps --format "{{.Names}}" | grep -q "$CONTAINER_INIT"; do
                                    echo "Building the environment. waiting..."
                                    sleep 10
                                done
                                docker logs $CONTAINER_INIT
                                echo "The environment has been built."
                                export KUBECONFIG=$PATH_KUBECONFIG
                                kubectl rollout restart deployment $APP_DEPLOYMENT -n $NAME_SPACE
                                """
                        }
                    }
                }
            }
        }
    }
    post {
        success {
            script {
                def buildDurationInSeconds = currentBuild.duration / 1000
                sh """
                cd "${URL_ALERT}"
                python3 slack-alert.py -S SUCCESS -D "${buildDurationInSeconds}"
                    """
            }
        }
        failure {
            sh """
                cd "${URL_ALERT}"
                python3 slack-alert.py -S FAILLED
                """
        }
    }
}


