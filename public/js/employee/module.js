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
