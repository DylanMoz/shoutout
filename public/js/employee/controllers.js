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

    $scope.submit = function() {
      var question = $("#question_"+0);
      console.log(question);

      for (var i = $scope.survey.questions.length - 1; i >= 0; i--) {
        $scope.survey.questions[i].response = $("#question_" + i).val();
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
