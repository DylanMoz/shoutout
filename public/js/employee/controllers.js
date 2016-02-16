angular.module('ShoutOut.Employee.Controllers', [])

.controller('EmployeeDashboardCtrl', ['$scope', '$location',
  function($scope, $location) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");
  }
])

.controller('ManageSurveyCtrl', ['$scope',
  'questionService',
  'toastService',
  function($scope, questionService, toastService) {

  }
])

.controller('EmployeeSurveyCtrl', ['$scope',
  'surveyService',
  function($scope, surveyService) {
    
  }
]);
