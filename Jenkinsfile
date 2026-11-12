pipeline {
  agent any
  tools { nodejs 'node24' }
  stages {
    stage('Check') {
      steps {
        sh 'node -v && npm -v'
        sh 'docker version'
      }
    }
  }
}