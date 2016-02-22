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
      },

      getAllSurveyResults: function(){
        return $http.get('/api/survey/all-results');
      },

      getEmployeeSurveyResults: function(){
        return $http.get('/api/survey/employee-results');
      }
    }
  }]
);
