pipeline {
  
  agent any
  
  tools {
    maven 'Maven 3.8.3'
    // jdk 'JDK11'
  }

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub')
  }

  parameters {
    booleanParam(name: 'Build_Simple_Backends', defaultValue: true )
    booleanParam(name: 'Build_Persitent_Backends', defaultValue: true )
    booleanParam(name: 'Build_Frontends', defaultValue: true )
  }
  
  stages {

    stage("Build Simple backends") {
      when {
        expression {
          params.Build_Simple_Backends == true
        }
      }
      steps {
        // Backend Catalog
        dir ('backends/in-memory/backend-catalog/') {
          sh 'mvn -Dmaven.test.failure.ignore=true install'
          sh 'docker build -t backend-catalog-image:simple -f docker/Dockerfile .'
          
        }

        //Backend Reviews
        dir ('backends/in-memory/backend-reviews/') {
          sh 'docker build -t backend-reviews-image:simple -f docker/Dockerfile .'
        }

      }
    }

    stage("Build persistent backends") {
      when {
        expression {
          params.Build_Persitent_Backends == true
        }
      }
      steps {
        // Backend Catalog
        dir ('backends/persistent/backend-catalog/') {
          sh 'mvn -Dmaven.test.failure.ignore=true install'
          sh 'docker build -t backend-catalog-image -f docker/Dockerfile .'
          
        }
        //Backend Store
        dir ('backends/persistent/backend-store/') {
          sh 'mvn -Dmaven.test.failure.ignore=true install'
          sh 'docker build -t backend-store-image -f docker/Dockerfile .'
        }      

        //Backend Reviews
        dir ('backends/persistent/backend-reviews/') {
          sh 'docker build -t backend-reviews-image -f docker/Dockerfile .'
        }

        //Backend Reviews
        dir ('backends/persistent/backend-shipping/') {
          sh 'docker build -t backend-shipping-image -f docker/Dockerfile .'
        }

      }
    }


    stage("Build Frontends") {
      when {
        expression {
          params.Build_Frontends == true
        }
      }

      steps {
        
        //Frontend catalog
        dir ('frontends/frontend-catalog/') {
          sh 'docker build -t frontend-catalog-image -f docker/Dockerfile .'
        }
        //Frontend reviews
        dir ('frontends/frontend-reviews/') {
          sh 'docker build -t frontend-reviews-image -f docker/Dockerfile .'
        }
        
        //Frontend store
        dir ('frontends/frontend-store/') {
          sh 'docker build -t frontend-store-image -f docker/Dockerfile .'
        }

      }
    }

    stage('Push Docker Images') {
      steps {
        // Login into dockerhub
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        // Pushing backend images
        sh 'docker tag backend-catalog-image chaphe/backend-catalog-image:1.0'
        sh 'docker push chaphe/backend-catalog-image:1.0'
        sh 'docker tag backend-reviews-image chaphe/backend-reviews-image:1.0'
        sh 'docker push chaphe/backend-reviews-image:1.0'
        sh 'docker tag backend-store-image chaphe/backend-store-image:1.0'
        sh 'docker push chaphe/backend-store-image:1.0'
        sh 'docker tag backend-shipping-image chaphe/backend-shipping-image:1.0'
        sh 'docker push chaphe/backend-shipping-image:1.0'
        // Pushing frontends images
        sh 'docker tag frontend-catalog-image chaphe/frontend-catalog-image:1.0'
        sh 'docker push chaphe/frontend-catalog-image:1.0'
        sh 'docker tag frontend-reviews-image chaphe/frontend-reviews-image:1.0'
        sh 'docker push chaphe/frontend-reviews-image:1.0'
        sh 'docker tag frontend-store-image chaphe/frontend-store-image:1.0'
        sh 'docker push chaphe/frontend-store-image:1.0'
      }
    }

    /*
    stage ('Deploy') {
      steps{
        sshagent(credentials : ['do-docker-server-credentials']) {
            //sh 'ssh -o StrictHostKeyChecking=no root@hostname.com uptime'
            //sh 'ssh -v user@hostname.com'
            sh 'ssh -o StrictHostKeyChecking=no root@164.92.73.70 docker ps'
            //sh 'scp ./source/filename user@hostname.com:/remotehost/target'
        }
      }
    }
*/
    
  }
}