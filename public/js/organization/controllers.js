angular.module('ShoutOut.Organization.Controllers', [])

.controller('OrganizationDashboardCtrl', ['$scope', '$location',
  function($scope, $location) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");
  }]
)

.controller('ManageSurveyCtrl', ['$scope', '$rootScope',
  'questionService',
  'surveyService',
  'toastService',
  function($scope, $rootScope, questionService, surveyService, toastService) {
    surveyService.getDraft()
      .then(function success(survey) {
        $scope.survey = survey.data;
      }, function error(err) {
        toastService.error('Unable to retrieve survey draft!!');
      });

    $scope.form = {

    };

    $scope.questionTypes = [
      {
        name: 'Select a type',
      },
      {
        name: 'Slider',
        value: 'slider'
      }
    ];

    $scope.autoFillEditForm = function(question) {
      $scope.editForm = {
        _id: question._id,
        name: question.name,
        type: question.type
      };
    }

    $scope.editQuestion = function(question) {
      $rootScope.loading = true;
      questionService.editQuestion(question, $scope.survey)
        .then(function success(survey) {
          form = {}; // Clear form
          $scope.survey = survey.data;
          toastService.success('Question has been saved!');
        }, function error() {
          toastService.error('Changes could not be saved :(');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }

    $scope.deleteQuestion = function(question) {
      $rootScope.loading = true;
      questionService.deleteQuestion(question, $scope.survey)
        .then(function success(survey) {
          $scope.survey = survey.data;
          toastService.success('Question has been deleted');
        }, function error() {
          toastService.error('Question was not deleted >:(');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }

    $scope.addQuestion = function(question) {
      $rootScope.loading = true;
      console.log('addquestion: ', question);
      questionService.addQuestion(question, $scope.survey)
        .then(function success(survey) {
          form = {}; // Clear form
          $scope.survey = survey.data;
          toastService.success('Question has been added!');
        }, function error() {
          toastService.error('Question was not added D:');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }
  }]
);
