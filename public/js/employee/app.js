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
    when('/results', {
      templateUrl: '/partials/employee/results',
      controller: 'EmployeeResultsCtrl'
    }).
    otherwise({
      redirectTo: 'dashboard'
    });

  $locationProvider.html5Mode(true);
});
