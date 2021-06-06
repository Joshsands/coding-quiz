// GIVEN I am taking a code quiz

// WHEN I click the start button
// THEN a timer starts and I am presented with a question

// WHEN I answer a question
// THEN I am presented with another question

// WHEN I answer a question incorrectly
// THEN time is subtracted from the clock

// WHEN all questions are answered or the timer reaches 0
// THEN the game is over

// WHEN the game is over
// THEN I can save my initials and score

// create an array of questions and answers

var questions = [
  {
    q: "Which of the following is not Javascript frameworks or libraries?",
    a: [
      { answer: "1. Polymer", feedback: false },
      { answer: "2. Meteor", feedback: false },
      { answer: "3. Cassandra", feedback: true },
      { answer: "4. jQuery", feedback: false },
    ],
  },
  {
    q: "What is the original name of JavaScript?",
    a: [
      { answer: "1. LiveScript", feedback: false },
      { answer: "2. EScript", feedback: false },
      { answer: "3. Mocha", feedback: true },
      { answer: "4. JavaScript", feedback: false },
    ],
  },
  {
    q: "Among the following, which one is a ternary operator in JavaScript?",
    a: [
      { answer: "1. #", feedback: false },
      { answer: "2. ::", feedback: false },
      { answer: "3. &:", feedback: false },
      { answer: "4. ?:", feedback: true },
    ],
  },
  {
    q: "Among the keywords below, which one is not a statement?",
    a: [
      { answer: "1. if", feedback: false },
      { answer: "2. with", feedback: false },
      { answer: "3. debugger", feedback: false },
      { answer: "4. use strict", feedback: true },
    ],
  },
];

// create global index, score and array variables
var questionIndex = 0;
var currentScore = 0;
var retrievedScores = [];

// create selector variables for html components
var answerContainerEl = document.querySelector("#answer-container");
var answerContainerEl = document.getElementById("answer-container");

var viewHighScoresEl = document.getElementById("view-high-scores");
var timeEl = document.getElementById("time");

var questionTextEl = document.getElementById("question-text");

var questionFeedbackEl = document.querySelector("#question-feedback");
var questionFeedbackIncorrectEl = document.querySelector("#question-feedback-incorrect");

// timeer countdown function
var countdown = function () {
  timeLeft = 60;

  timeInterval = setInterval(function () {
    if (timeLeft >= 0) {
      timeEl.textContent = "Time: " + timeLeft;
      timeLeft--;
    } else {
      clearInterval(timeInterval);
      reset();
      enterName();
    }
  }, 1000);
};

// runs the show question function again if there are any questions left in array otherwise continues to enter initials page.
var nextQuestion = function () {
  if (questionIndex < questions.length) {
    showQuestion(questions[questionIndex]);
  } else {
    clearInterval(timeInterval);
    enterName();
  }
};

// enter initials page
var enterName = function () {
  questionTextEl.textContent = "All done!";

  finalScoreEl = document.createElement("p");
  finalScoreEl.textContent = "Your final score is " + currentScore + ".";

  answerContainerEl.append(finalScoreEl);

  initialsContainer = document.createElement("div");
  initialsContainer.id = "form-container";
  initialsContainer.className = "flex-box";
  answerContainerEl.append(initialsContainer);

  enterInitials = document.createElement("p");
  enterInitials.textContent = "Enter initials:";

  formBox = document.createElement("form");
  formBox.setAttribute = ("method", "post");

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Enter initials here");
  input.setAttribute("id", "input-control");

  submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.className = "choice2";
  submitButton.id = "initials-submit-btn";

  initialsContainer.append(enterInitials, formBox, input, submitButton);

  submitButton.addEventListener("click", returnInitials);
};

// pushes previous scores into array
var returnInitials = function () {
  var userInitials = document.querySelector("#input-control").value;
  retrievedScores.push(currentScore, userInitials);

  localStorage.setItem("lastPlayer", JSON.stringify(retrievedScores));
  resetHighscorePage();
};

// creates new highscore entry
var retrieveLastScores = function () {
  for (var i = 0; i < retrievedScores.length / 2; i++) {
    var savedScoreEl = document.createElement("p");
    savedScoreEl.textContent =
      i +
      1 +
      "." +
      retrievedScores[i * 2 + 1] +
      "-(" +
      retrievedScores[i * 2] +
      ")";
    savedScoreEl.id = "highscores";
    savedScoreEl.className = "highlight";
    questionTextEl.append(savedScoreEl);
  }
};

// removes previous question elements before create highscore page
var resetHighscorePage = function () {
  while (initialsContainer.firstChild) {
    initialsContainer.removeChild(initialsContainer.firstChild);
  }
  highscorePage();
};

//creates container element for when the highscore page link is clicked
var createContainer = function () {
  initialsContainer = document.createElement("div");
  initialsContainer.id = "form-container";
  initialsContainer.className = "flex-box";
  answerContainerEl.append(initialsContainer);

  finalScoreEl = document.createElement("p");

  answerContainerEl.append(finalScoreEl);
};

// creates highscore page
var highscorePage = function () {
  viewHighScoresEl.textContent = "";
  timeEl.textContent = "";

  questionTextEl.textContent = "Highscores";

  retrieveLastScores();

  questionFeedbackEl.classList.add("hide");
  finalScoreEl.className = "hide";

  var goBack = document.createElement("button");
  goBack.textContent = "Go Back";
  goBack.className = "choice2";

  var clearHighscores = document.createElement("button");
  clearHighscores.textContent = "Clear Highscores";
  clearHighscores.className = "choice3";

  initialsContainer.append(goBack, clearHighscores);

  goBack.addEventListener("click", function () {
    clearHighscores.remove();
    goBack.remove();
    introPage();
  });

  clearHighscores.addEventListener("click", function () {
    for (var i = 0; i < retrievedScores.length / 2; i++) {
      var savedScoreEl = document.getElementById("highscores");
      savedScoreEl.remove();
    }
    retrievedScores = [];
    localStorage.clear();
  });
};

// creates the next question based on the question index variable
var showQuestion = function (questions) {
  viewHighScoresEl.addEventListener("click", function () {
    reset();
    createContainer();
    highscorePage();
  });

  questionTextEl.textContent = questions.q;

  questions.a.forEach(function (ans) {
    choiceEl = document.createElement("button");
    choiceEl.className = "choice1";
    choiceEl.textContent = ans.answer;
    var decision = ans.feedback;

    answerContainerEl.append(choiceEl);

    if (decision) {
      choiceEl.addEventListener("click", answerCorrect);
    } else {
      choiceEl.addEventListener("click", answerIncorrect);
    }
  });
  questionIndex++;
};

// shows correct at bottom of screen when correct answer is clicked and adds 25 pts
var answerCorrect = function () {
  feedbackTime = 500;

  feedbackInterval = setInterval(function () {
    if (feedbackTime >= 0) {
      questionFeedbackEl.classList.remove("hide");
      feedbackTime--;
    } else {
      questionFeedbackEl.classList.add("hide");
      clearInterval(feedbackInterval);
    }
  }, 1);

  currentScore = currentScore + 25;

  reset();
  nextQuestion();
};

// shows incorrect at bottom of screen and subtracts 10 pts and 10 seconds from timer
var answerIncorrect = function () {
  feedbackTimeWrong = 500;

  feedbackIntervalWrong = setInterval(function () {
    if (feedbackTimeWrong >= 0) {
      questionFeedbackIncorrectEl.classList.remove("hide");
      feedbackTimeWrong--;
    } else {
      questionFeedbackIncorrectEl.classList.add("hide");
      clearInterval(feedbackIntervalWrong);
    }
  }, 1);

  currentScore = currentScore - 10;
  timeLeft = timeLeft - 10;

  reset();
  nextQuestion();
};

// starts the count down, resets the page for questions and calls the next questions function
var startQuiz = function () {

  countdown();

  var startButtonEl = document.getElementById("start-button");
  startButtonEl.className = "hide border";

  questionIndex = 0;

  nextQuestion();
};

// resets the question page by removing the previous question button elements
var reset = function () {
  while (answerContainerEl.firstChild) {
    answerContainerEl.removeChild(answerContainerEl.firstChild);
  }
};

// creates intro page
var introPage = function () {
  currentScore = 0;
  viewHighScoresEl.textContent = "View high scores";
  questionTextEl.textContent = "Coding Quiz Challange";

  var introText = document.createElement("p");
  introText.textContent =
    "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will reduce your score and and penalize your remaining time by ten seconds!";
  questionTextEl.append(introText);

  var startButtonEl = document.createElement("button");
  startButtonEl.textContent = "Start Quiz";
  startButtonEl.id = "start-button";
  startButtonEl.className = "start-button";
  questionTextEl.append(startButtonEl);

  startButtonEl.addEventListener("click", startQuiz);

  viewHighScoresEl.addEventListener("click", createContainer, highscorePage);
};

// loads previous scores to be displayed on highscores page
var loadPreviousScores = function () {
  var allScoresSaved = localStorage.getItem("lastPlayer");
  if (!allScoresSaved) {
    return false;
  }
  var allScoresSaved = JSON.parse(allScoresSaved);

  for (var i = 0; i < allScoresSaved.length; i++) {
    retrievedScores.push(allScoresSaved[i]);
  }
};

loadPreviousScores();
introPage();
