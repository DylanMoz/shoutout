angular.module('ShoutOut.Organization', [
  'ShoutOut.Organization.Controllers',

  'ShoutOut.Shared',

  'ngRoute',

  'ui.materialize'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/dashboard', {
      templateUrl: '/partials/organization/dashboard',
      controller: 'OrganizationDashboardCtrl'
    }).
    when('/manage/draft', {
      templateUrl: '/partials/organization/manage-survey',
      controller: 'ManageSurveyCtrl'
    }).
    otherwise({
      redirectTo: 'dashboard'
    });

  $locationProvider.html5Mode(true);
});
