
var startTime;

angular.module('ShoutOut.Employee.Controllers', [])

.controller('EmployeeDashboardCtrl', ['$scope', '$location',
  'surveyService',
  'toastService',
  function($scope, $location, surveyService, toastService) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");
    var graphData = {};
    var questions = {}; 

    

    $(document).ready(function() {
      startTime = new Date().getTime();

      $(window).unload(function(){
        var endTime = new Date().getTime();
        var totalTime = endTime - startTime;
        ga('send', 'event',{
          'eventCategory' :'employeeDashTime1',
          'eventAction' : totalTime 
        });       
      });

    });




    surveyService.getEmployeeSurveyResults()
     .then(function success(responses) {
        console.log(responses);
        $scope.responses = responses.data;
        graphData = {};
        for (var i = $scope.responses.length - 1; i >= 0; i--) {
          var answers = $scope.responses[i].answers;
          for (var j = answers.length - 1; j >= 0; j--) {
            var answer = answers[j];
            questions[answer.name] = answer;
            if (!graphData[answer.name]){
              graphData[answer.name] = [];
            }
            graphData[answer.name].push(answer.response);
          };
        };
        google.charts.setOnLoadCallback(drawChart);
      }, function error(err) {
        toastService.error('Unable to retrieve personal survey results!!');
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
                       'width':400,
                       'height':300};

        var $elem = $('<div id="chart_div_'+index+'"></div>');
        container.append($elem);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div_'+index));
        chart.draw(data, options);  
        index++;
      }
 
    }
  }]
)

.controller('EmployeeSurveyCtrl', ['$scope', '$location',
  'surveyService',
  'toastService',
  function($scope, $location, surveyService, toastService) {
    surveyService.getCurrentSurvey()
      .then(function success(survey) {
        $scope.survey = survey.data;
      }, function error(err) {
        toastService.error('Unable to retrieve survey draft!!');
      });

    $(document).ready(function() {
      var endTime = new Date().getTime();
      var totalTime = endTime - startTime;
      ga('send', 'event',{
        'eventCategory' :'employeeDashTime1',
        'eventAction' : totalTime 
      });
    });


    $scope.selectTypes = [
      {
        name: 'Select an answer',
      },
      {
        name: 'Satisfied',
        value: '1'
      },

      {
        name: 'Dissatisfied',
        value: '2'
      },
      {
        name: 'Not Applicable',
        value: '3'
      }
    ];

    $scope.submit = function() {
      var question = $("#question_"+0);
      console.log(question);

      for (var i = $scope.survey.questions.length - 1; i >= 0; i--) {
        if ($scope.survey.questions[i].type === 'slider') {
          $scope.survey.questions[i].response = $("#question_" + i).val();
        } else if ($scope.survey.questions[i].type === 'select') {
          if ( $scope.survey.questions[i].selectedValue != undefined) {
            $scope.survey.questions[i].response = $scope.survey.questions[i].selectedValue;
          }
          else {
            $scope.survey.questions[i].response = "Not Applicable";
          }
 
        }
      };
      console.log($scope.survey.questions);
      surveyService.submitSurvey($scope.survey)
        .then(function success(survey) {
          toastService.success('Your survey has been submitted!');
          $location.path("/dashboard");
        }, function error(err) {
          toastService.error('Unable to retrieve survey draft!!');
        });
    }
  }

])

.controller('EmployeeResultsCtrl', ['$scope', '$location',
  'surveyService',
  'toastService',
  function($scope, $location, surveyService, toastService) {
    $scope.url = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" + $location.port() : "");

    var graphData = {};
    var questions = {}; 

    surveyService.getEmployeeSurveyResults()
     .then(function success(responses) {
        console.log(responses);
        $scope.responses = responses.data;
        graphData = {};
        for (var i = $scope.responses.length - 1; i >= 0; i--) {
          var answers = $scope.responses[i].answers;
          for (var j = answers.length - 1; j >= 0; j--) {
            var answer = answers[j];
            questions[answer.name] = answer;
            if (!graphData[answer.name]){
              graphData[answer.name] = [];
            }
            graphData[answer.name].push(answer.response);
          };
        };
        google.charts.setOnLoadCallback(drawChart);
      }, function error(err) {
        toastService.error('Unable to retrieve personal survey results!!');
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
                       'width':400,
                       'height':300};

        var $elem = $('<div id="chart_div_'+index+'"></div>');
        container.append($elem);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div_'+index));
        chart.draw(data, options);  
        index++;
      }
 
    }
  }]
);
