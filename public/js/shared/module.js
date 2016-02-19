angular.module('ShoutOut.Shared', [
  'ShoutOut.Shared.Header',
  'ShoutOut.Shared.Services'
]);

angular.module('ShoutOut.Shared.Header', []);
angular.module('ShoutOut.Shared.Services', []);

angular.module('ShoutOut.Shared.Services')

.service('questionService', ['$http',
  function($http) {

    return {
      editQuestion: function(question, survey) {
        return $http.put('/api/survey/' + survey._id + '/question/' + question._id, question);
      },

      deleteQuestion: function(question, survey) {
        return $http.delete('/api/survey/' + survey._id + '/question/' + question._id);
      },

      addQuestion: function(question, survey) {
        return $http.post('/api/survey/' + survey._id + '/question', question);
      }
    }
  }]
);

angular.module('ShoutOut.Shared.Services')

.service('surveyService', ['$http',
  function($http) {

    return {
      getDraft: function() {
        return $http.get('/api/survey/draft');
      },

      publish: function(draft) {
        return $http.post('/api/survey/publish/draft', draft);
      },

      getCurrentSurvey: function() {
        return $http.get('/api/survey/current');
      },

      submitSurvey: function(survey) {
        return $http.post('/api/survey/submit', survey);
      },

      getSurveyResults: function() {
        return $http.get('/api/survey/results');
      }
    }
  }]
);

angular.module('ShoutOut.Shared.Services')

.service('toastService', ['$http',
  function($http) {

    return {
      success: function(message, options) {
        Materialize.toast(
          message,
          3000 || options.duration,
          'toast-success'
        );
      },

      error: function(message, options) {
        Materialize.toast(
          message,
          3000 || options.duration,
          'toast-error'
        );
      },

      info: function(message, options) {
        Materialize.toast(
          message,
          3000 || options.duration,
          'toast-info'
        );
      }
    }
  }]
);

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
