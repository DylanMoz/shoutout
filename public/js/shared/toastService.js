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
