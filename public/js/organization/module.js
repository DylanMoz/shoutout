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
    when('/all-results', {
      templateUrl: '/partials/organization/all-results',
      controller: 'AllResultsCtrl'
    }).
    otherwise({
      redirectTo: 'dashboard'
    });

  $locationProvider.html5Mode(true);
});

var startTime;

angular.module('ShoutOut.Organization.Controllers', [])

.controller('OrganizationDashboardCtrl', ['$scope', '$location',
  'surveyService',
  'toastService',
  function($scope, $location, surveyService, toastService) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");


    var graphData = {};
    var questions = {};

    surveyService.getCurrentSurvey()
      .then(function success(survey) {
         $scope.surveyCreated = survey.data.submitted;
        }, function error(data) {
        toastService.error('Unable to retrieve current survey!');
       });
 

    $(document).ready(function() {
      startTime = new Date().getTime();

      $(window).unload(function(){
        var endTime = new Date().getTime();
        var totalTime = endTime - startTime;
        ga('send', 'event',{
          'eventCategory' :'orgDashTime1',
          hAxis: {title: 'Date'},
          vAxis: {title: 'Score'},
          'eventAction' : totalTime
        }); 
      });

    });


    surveyService.getSurveyResults()
     .then(function success(responses) {
        console.log(responses)
        $scope.responses = responses.data;
        graphData = {};
        for (var i = $scope.responses.length - 1; i >= 0; i--) {
          var answers = $scope.responses[i].answers;
          for (var j = answers.length - 1; j >= 0; j--) {
            var answer = answers[j];
            questions[answer._id] = answer;
            if (!graphData[answer._id]){
              graphData[answer._id] = [];
            }
            graphData[answer._id].push(answer.response);
          };
        };
        google.charts.setOnLoadCallback(drawChart);
      }, function error(err) {
        toastService.error('Unable to retrieve current survey results!!');
      });




    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
      var container = $('.chart_container');
      var index = 0;
      for (var question_id in graphData) {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Value');
        data.addColumn('number', 'Number of Responses');
        var groupedResponses = {};
        for (var i = graphData[question_id].length - 1; i >= 0; i--) {
          var value = graphData[question_id][i];
          if (!groupedResponses[value])
            groupedResponses[value] = 0;

          groupedResponses[value] += 1;
        };


        var rows = [];
        for(var group in groupedResponses) {
          rows.push([group, groupedResponses[group]]);
        }
        data.addRows(rows);

        // Set chart options
        var options = {'title': questions[question_id].name,
                       'width':500,
                       'height':300,
                        hAxis: {title: 'Number of Responses'},
                        vAxis: {title: 'Response'},
                        legend:'none'};

        var $elem = $('<div id="chart_div_'+index+'"></div>');
        container.append($elem);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div_'+index));
        chart.draw(data, options);
        index++;
      }

    }
  }]
)

.controller('AllResultsCtrl', ['$scope', '$location',
  'surveyService',
  'toastService',
  function($scope, $location, surveyService, toastService) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");

    var graphData = {};
    var questions = {}; 

    $(document).ready(function() {
      ga('send', 'event',{
        'eventCategory' :'all_results',
        'eventAction' : 'click' 
      }); 


      var endTime = new Date().getTime();
      var totalTime = endTime - startTime;
      ga('send', 'event',{
        'eventCategory' :'orgDashTime1',
        'eventAction' : totalTime
      }); 
    });

    surveyService.getAllSurveyResults()
     .then(function success(responses) {
        $scope.responses = responses.data;
        graphData = {};
        for (var i = $scope.responses.length - 1; i >= 0; i--) {
          var date = $scope.responses[i].submitted;
          var answers = $scope.responses[i].answers;
          for (var j = answers.length - 1; j >= 0; j--) {
            var answer = answers[j];
            questions[answer.name] = answer;
            if (!graphData[answer.name]){
              graphData[answer.name] = [];
            }
            graphData[answer.name].push([answer.response, date]);
          };
        };
        google.charts.setOnLoadCallback(drawChart);
      }, function error(err) {
        toastService.error('Unable to retrieve current survey results!!');
      }); 




    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
      var container = $('.chart_container');

      var index = 0;
        console.log("print");
        console.log(graphData);
      for (var question_id in graphData) {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Value');
        var groupedResponses = {};
        console.log("quesiton_id");
        console.log(graphData[question_id]);

       
        for (var i = graphData[question_id].length - 1; i >= 0; i--) {
           var value = graphData[question_id][i][0];
           var date = graphData[question_id][i][1];
           var updateDate = new Date(date);
           if (value == "Satisfied")
              value = 2
           if (value == "Not Applicable")
              value = 1
           if (value == "Dissatisfied")
              value = 0
           console.log(updateDate);
          var rows = [];
          rows.push([updateDate, Number(value)]);
                  data.addRows(rows);
        };


        // Set chart options
        var options = {'title': questions[question_id].name,
                       'width':500,
                       'height':300,
                        hAxis: {title: 'Date'},
                        vAxis: {title: 'Score'},
                        legend: 'none'
        };

        var $elem = $('<div id="chart_div_'+index+'"></div>');
        container.append($elem);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_'+index));
        chart.draw(data, options);  
        index++;


      }
 
    }
  }]
)


.controller('ManageSurveyCtrl', ['$scope', '$rootScope', '$location',
  'questionService',
  'surveyService',
  'toastService',
  function($scope, $rootScope, $location, questionService, surveyService, toastService) {
    surveyService.getDraft()
      .then(function success(survey) {
        $scope.survey = survey.data;
      }, function error(err) {
        toastService.error('Unable to retrieve survey draft!!');
      });

    $(document).ready(function() {

      var endTime = new Date().getTime();
      var totalTime = endTime - startTime;
      ga('send', 'event',{
        'eventCategory' :'orgDashTime1',
        'eventAction' : totalTime
      }); 
    });

    $scope.form = {

    };

    $scope.questionTypes = [
      {
        name: 'Select a type',
      },
      {
        name: 'Slider',
        value: 'slider'
      },
      {
        name: 'Select',
        value: 'select'
      }
    ];

    $scope.publish = function() {
      $rootScope.loading = true;
      surveyService.publish()
        .then(function success() {
          toastService.success('Your draft has been published!');
          $location.path("/dashboard");
        }, function error() {
          toastService.error('Your draft could not be published :(');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }

    $scope.autoFillEditForm = function(question) {
      $scope.editForm = {
        _id: question._id,
        name: question.name,
        type: question.type
      };
    }

    $scope.editQuestion = function(question) {
      $rootScope.loading = true;
      questionService.editQuestion(question, $scope.survey)
        .then(function success(survey) {
          form = {}; // Clear form
          $scope.survey = survey.data;
          toastService.success('Question has been saved!');
        }, function error() {
          toastService.error('Changes could not be saved :(');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }

    $scope.deleteQuestion = function(question) {
      $rootScope.loading = true;
      questionService.deleteQuestion(question, $scope.survey)
        .then(function success(survey) {
          $scope.survey = survey.data;
          toastService.success('Question has been deleted');
        }, function error() {
          toastService.error('Question was not deleted >:(');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }

    $scope.addQuestion = function(question) {
      $rootScope.loading = true;
      console.log('addquestion: ', question);
      questionService.addQuestion(question, $scope.survey)
        .then(function success(survey) {
          form = {}; // Clear form
          $scope.survey = survey.data;
          toastService.success('Question has been added!');
        }, function error() {
          toastService.error('Question was not added D:');
        })
        .finally(function() {
          $rootScope.loading = false;
        });
    }
  }]
);

