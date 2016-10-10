(function() {

   /* hard input: i-midterm-1 i-midterm-2 i-final i-homework-count i-quiz-count */
   /* hard containers: d-homework-scores d-quiz-scores */
   /* logical input: i-model */

   function convertInputsToArray(containerSelector) {
      var inputValues = [];

      $(containerSelector).children("input").each(function() {
         inputValues.push(~~Number($(this).val()));
      });

      return inputValues;
   }

   function scoreToLetter(score) {
      if (score >= 93) {
         return "A";
      } else if (score >= 90) {
         return "A-";
      } else if (score >= 87) {
         return "B+";
      } else if (score >= 83) {
         return "B";
      } else if (score >= 80) {
         return "B-";
      } else if (score >= 77) {
         return "C+";
      } else if (score >= 70) {
         return "C";
      } else if (score >= 60) {
         return "D";
      } else {
         return "F";
      }
   }

   function sortNumber(a,b) {
      return a - b;
   }

   function calcScore() {
      var totalHomeworks = ~~Number($("input#i-homework-count").val());
      var totalQuizzes = ~~Number($("input#i-quiz-count").val());
      var homeworkScores = convertInputsToArray("div#d-homework-scores").sort(sortNumber);
      var quizScores = convertInputsToArray("div#d-quiz-scores").sort(sortNumber);
      var midtermOneScore = ~~Number($("input#i-midterm-1").val());
      var midtermTwoScore = ~~Number($("input#i-midterm-2").val());
      var finalExamScore = ~~Number($("input#i-final").val());

      var homeworksDropped = 1;
      var quizzesDropped = 3;

      /* drop this many homework grades */
      while (homeworkScores.length > 0 && homeworksDropped--) {
         var lowHomework = homeworkScores.shift();
         console.log("dropping low homework score: ", lowHomework);
      }

      /* reduce over addition */
      var homeworkScoreSum = _.reduce(homeworkScores, function(first, second) {
         return first + second;
      }, 0);

      /* drop this many quiz grades */
      while (quizScores.length > 0 && quizzesDropped--) {
         var lowQuiz = quizScores.shift();
         console.log("dropping low quiz score: ", lowQuiz);
      }

      /* reduce over addition */
      var quizScoreSum = _.reduce(quizScores, function(first, second) {
         return first + second;
      }, 0);

      var weightedHomeworks = (homeworkScores.length > 0) ? (0.25 * (homeworkScoreSum / homeworkScores.length))
            : (0);

      console.log("weighted sum of homeworks: ", weightedHomeworks, "number of homeworks: ", homeworkScores.length);

      var weightedQuizzes = (quizScores.length > 0) ? (0.15 * (quizScoreSum / quizScores.length))
            : (0);

      console.log("weighted sum of quizzes: ", weightedQuizzes, "number of quizzes: ", quizScores.length);

      var weightedExams = 0.15 * midtermOneScore + 0.15 * midtermTwoScore + 0.3
            * finalExamScore;

      console.log("weighted sum of exams: ", weightedExams);

      var floatScore = weightedHomeworks + weightedQuizzes + weightedExams;

      console.log("float score: ", floatScore);

      var intScore = Math.ceil(floatScore);

      console.log("rounded score: ", intScore);

      if (intScore != NaN) {
         $("span#s-grade-output").html(intScore + " " + scoreToLetter(intScore));
      } else {
         $("span#s-grade-output").html("error");
      }
   }

   $("input#i-quiz-count").on("change", calcScore);
   $("input#i-homework-count").on("change", calcScore);
   $("input#i-midterm-1").on("change", calcScore);
   $("input#i-midterm-2").on("change", calcScore);
   $("input#i-final").on("change", calcScore);

   function adjustFieldCount(ev) {
      var targetDiv = undefined;

      if ($(ev.target).is("input#i-homework-count")) {
         targetDiv = $("div#d-homework-scores");
      } else if ($(ev.target).is("input#i-quiz-count")) {
         targetDiv = $("div#d-quiz-scores");
      } else {
         return;
      }

      var desiredNumInputs = parseInt($(this).val());
      var startNumInputs = $(targetDiv).children("input").length;

      if (desiredNumInputs < startNumInputs) {
         while ($(targetDiv).children("input").length != desiredNumInputs) {
            $(targetDiv).children("input").filter(":last").remove();
         }
      } else if (desiredNumInputs > startNumInputs) {
         while ($(targetDiv).children("input").length != desiredNumInputs) {
            /*
             * de-duplicate ids, otherwise we get a nasty recurrence relation
             * and the browser chokes
             */

            $(targetDiv).append(
                  $("input#i-midterm-1").clone().removeAttr("id").removeAttr(
                        "style").attr("min", "0").attr("max", "100").val(0).on(
                        "change", calcScore));
         }
      }
   }

   $("input#i-homework-count").on("change", adjustFieldCount);
   $("input#i-quiz-count").on("change", adjustFieldCount);

   /* trigger initial update of field count */
   $(document).ready(function() {
      $("input#i-homework-count").trigger("change");
      $("input#i-quiz-count").trigger("change");
   });

   $("button#b-update-input").on("click", function(ev) {
      ev.preventDefault();

      $("input#i-homework-count").trigger("change");
      $("input#i-quiz-count").trigger("change");
   });

})();
