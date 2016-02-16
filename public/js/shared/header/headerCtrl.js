angular.module('ShoutOut.Shared.Header')

.controller('HeaderCtrl', ['$rootScope',
  'userService',
  function($rootScope, userService) {
    userService.getUser()
      .success(function(data) {
        $rootScope.user = data.user;
      });
  }]
);
