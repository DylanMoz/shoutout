angular.module('ShoutOut.Employee', [
  'ShoutOut.Employee.Controllers',
  /*
  'ShoutOut.Employee.Filters',
  'ShoutOut.Employee.Services',
  'ShoutOut.Employee.Directives',
  */
  'ShoutOut.Shared',

  'ngRoute',

  'ui.materialize'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/dashboard', {
      templateUrl: '/partials/employee/dashboard',
      controller: 'EmployeeDashboardCtrl'
    }).
    when('/survey', {
      templateUrl: '/partials/employee/survey',
      controller: 'EmployeeSurveyCtrl'
    }).
    otherwise({
      redirectTo: 'dashboard'
    });

  $locationProvider.html5Mode(true);
});

angular.module('ShoutOut.Employee.Controllers', [])

.controller('EmployeeDashboardCtrl', ['$scope', '$location',
  function($scope, $location) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");
  }
])

.controller('EmployeeSurveyCtrl', ['$scope', '$location',
  'surveyService',
  'toastService',
  function($scope, $location, surveyService, toastService) {
    surveyService.getCurrentSurvey()
      .then(function success(survey) {
        $scope.survey = survey.data;
      }, function error(err) {
        toastService.error('Unable to retrieve survey draft!!');
      });

    $scope.selectTypes = [
      {
        name: 'Select an answer',
      },
      {
        name: 'Satisfied',
        value: '1'
      },
      {
        name: 'Not Applicable',
        value: '2'
      },
      {
        name: 'Dissatisfied',
        value: '3'
      }
    ];

    $scope.submit = function() {
      var question = $("#question_"+0);
      console.log(question);

      for (var i = $scope.survey.questions.length - 1; i >= 0; i--) {
        if ($scope.survey.questions[i].type === 'slider') {
          $scope.survey.questions[i].response = $("#question_" + i).val();
        } else if ($scope.survey.questions[i].type === 'select') {
          $scope.survey.questions[i].response = $scope.survey.questions[i].selectedValue;
        }
      };
      console.log($scope.survey.questions);
      surveyService.submitSurvey($scope.survey)
        .then(function success(survey) {
          toastService.success('Your survey has been submitted!');
          $location.path("/dashboard");
        }, function error(err) {
          toastService.error('Unable to retrieve survey draft!!');
        });
    }
  }
]);
