angular.module('ShoutOut.Shared.Services')

.service('userService', ['$http',
  function($http) {

    return {
      getUser: function() {
        return $http.get('/api/user');
      }
    }
  }]
);
