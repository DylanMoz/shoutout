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
