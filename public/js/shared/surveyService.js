angular.module('ShoutOut.Shared.Services')

.service('surveyService', ['$http',
  function($http) {

    return {
      getDraft: function() {
        return $http.get('/api/survey/draft');
      },

      publishDraft: function(draft) {
        return $http.post('/api/survey/publish/draft', draft);
      }
    }
  }]
);
