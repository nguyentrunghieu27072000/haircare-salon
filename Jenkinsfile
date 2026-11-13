pipeline {
  agent any
  tools { nodejs 'node24' }
  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
        sh 'test -f dist/main.js'
      }
    }
  }
  post {
    success { echo 'Build OK' }
    failure { echo 'Build FAILED' }
  }
}
