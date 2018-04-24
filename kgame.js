
// Get the images
var imgs = [];

// Connect to spreadsheet

$.getJSON("https://spreadsheets.google.com/feeds/list/1neBPd5rdfK2MvMv-iSksqSMRvBJFSjkcSRNBj8sJMko/od6/public/values?alt=json", function(data) {
  for (var el in data.feed.entry) {
    imgs.push({
      key: el,
      value: data.feed.entry[el].gsx$imgurl.$t +" "+ data.feed.entry[el].gsx$charactername.$t
    });
  }
  console.log(imgs);
  return imgs;
});


// get images from spreadsheet

var imgUrl;

function extractImgUrlFromDict(key) {
  var imgToExtract = imgs[key].value;
  imgUrl = imgToExtract.substr(0,imgToExtract.indexOf(" ",0));
  console.log(imgUrl);
  return imgUrl;
}

// Display Image
function displayImg(key) {
  extractImgUrlFromDict(key);
  displayedImg.setAttribute("src",imgUrl);
}

// Game Setup

// Player names
var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");

function setPlayerNames() {
  player1.innerHTML = document.getElementById("playerInput1").value;
  player2.innerHTML = document.getElementById("playerInput2").value;
}

// Score
var gameMaxScore = 11;
function setGameScore() {
  gameMaxScore = document.getElementById("gameScoreInput").value;
  console.log("Game is in "+ gameMaxScore + " points");
  return gameMaxScore;
}

// Time
var timeAvailable = 4000;
function setTime() {
  var timeInput = document.getElementById("gameTimeInput").value;
  timeAvailable = Number(timeInput);
  // timeAvailable = 4000;
  console.log(timeAvailable);
}

// Setup Game
var gameIsSetup = false;
var initiateGameSetup = document.getElementById("setupGame");

initiateGameSetup.onclick = function() {
  setupGame();
};

function setupGame() {
  setPlayerNames();
  setTime();
  setGameScore();
  gameIsSetup = true;
  return gameIsSetup;
}

// Start Game
var level = 0;

function startGame() {
  console.log("Round" + level + " || Player 1: "+ scorePlayer1 + "|| Player 2: "+ scorePlayer2);
  if (gameIsSetup) {
    if ( (scorePlayer1 < gameMaxScore) && (scorePlayer2 < gameMaxScore) ) {
      $('#buzzerImgContainer').css({"display" : "none"});
      resetBuzzers();
      startCountDown(timeAvailable);
      displayImg(level);
      level += 1;
      console.log(level);
      return level;
    }
    else if (scorePlayer1 == gameMaxScore ) {
      console.log("Player 1 wins!");
      player1.innerHTML = "👑 " + document.getElementById("playerInput1").value + " 👑";
    }

    else if (scorePlayer2 == gameMaxScore) {
      console.log("Player 2 wins");
      player2.innerHTML = "👑 " + document.getElementById("playerInput2").value + " 👑";
    }
    else {
      console.log("Game oveeer !")
    }
  }
  else {
    console.log("Please setup game")
  }
}

// Get dom elements

var startGameButton = document.getElementById("startGame");
var displayedImg = document.getElementById("displayedImg");
var controlZone = document.getElementById("controls");
var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");
var zoneScorePlayer1 = document.getElementById("scorePlayer1");
var zoneScorePlayer2 = document.getElementById("scorePlayer2");


startGameButton.onclick = function() {
  startGame();
  $('.controls').hide();
};

// BUZZER

// BUZZER SOUND
var buzzerSoundPlayer1 = new Audio('foghi.mp3');
var buzzerSoundPlayer2 = new Audio('foghi.mp3');

// Initial state of the game
var player1CanBuzz = true;
var player2CanBuzz = true;

var hasBuzzedPlayer_1 = false;
var hasBuzzedPlayer_2 = false;

var whoHasBuzzed;

// What happens when someone buzzes

function hasBuzzed(p) {
  if (p == 1 && player1CanBuzz) {
    buzzerSoundPlayer1.play();
    $('#buzzerImgContainer').css({  "display" : "inline-block", "left" : "10px" });
    timeToAnswer(1);
    whoHasBuzzed = p;
    return whoHasBuzzed;
  }

  else if (p == 2 && player2CanBuzz) {
    buzzerSoundPlayer2.play();
    $('#buzzerImgContainer').css({  "display" : "inline-block", "left" : $(window).width() - 200 });
    timeToAnswer(2);
    whoHasBuzzed = p;
    return whoHasBuzzed;
  }
}

function highlightPlayer(n) {
  var playerToHighlight = document.getElementById("zonePlayer"+ n );
  playerToHighlight.classList.toggle("playerHighlighted");
}

var gaugeHeight;
var answerTime = 0;
var y;

function  timeToAnswer(p) {
  cantBuzz();
  highlightPlayer(p);
  stopCountDown();
  y = setInterval(function() {
    answerTime += 100;
    if (answerTime < 3000) {
      gaugeHeight = Math.floor((answerTime * 170) / 3000);
      $('#gauge').css({"height" : gaugeHeight});
      return answerTime;
    }
    else if (answerTime == 3000) {
      clearInterval(y);
      console.log("time's up");
      $('#buzzerImgContainer').css({"display" : "none"});
      player1CanBuzz = true;
      player2CanBuzz = false;
      gaugeHeight = 0;
      answerTime = 0;
      scoreDown(p);
      // startCountDown(distance);
      return answerTime;
    }
  }, 100);
}


function resetBuzzers() {
  player1CanBuzz = true;
  player2CanBuzz = true;
  whoHasBuzzed = 0;
}

function cantBuzz() {
  player1CanBuzz = false;
  player2CanBuzz = false;
}


// SCORE

var scorePlayer1 = 0;
var scorePlayer2 = 0;

function scoreUp(p) {
  clearInterval(y);
  if (p == whoHasBuzzed) {
    if (p == "1") {
      scorePlayer1 += 1;
      zoneScorePlayer1.textContent = scorePlayer1;
      highlightPlayer(1);
      startGame();
      return scorePlayer1;
    }
    else if (p == "2") {
      scorePlayer2 += 1;
      zoneScorePlayer2.textContent = scorePlayer2;
      highlightPlayer(2);
      startGame();
      return scorePlayer2;
    }
  }
}

function scoreDown(p) {
  if (p == whoHasBuzzed) {
    clearInterval(y);
    if (p == "1") {
      scorePlayer1 -= 1;
      zoneScorePlayer1.textContent = scorePlayer1;
      highlightPlayer(1);
      startGame();
      return scorePlayer1;
    }
    else if (p == "2") {
      scorePlayer2 -= 1;
      zoneScorePlayer2.textContent = scorePlayer2;
      highlightPlayer(2);
      startGame();
      return scorePlayer2;
    }
  }
}

function changeScore(p,d) {
  console.log(eval("scorePlayer" + p) + d);
  changeScoreToPlayer = eval("scorePlayer" + p);
  changeScoreToPlayer += d;
  document.getElementById("scorePlayer" + p).textContent = changeScoreToPlayer;
  highlightPlayer(p);
  startGame();
  return eval("scorePlayer" + p);
}

///////////////////////////////////

var isPaused = false;

$(document).keydown(function(e) {
    switch (e.which) {
    case 37: //left arrow key // score player 1
      scoreUp(1);
      break;

    case 39: //right arrow key // score player 2
      scoreUp(2);
      break;

    case 67: // C key // downscore player 1
      // scoreDown(1);
      break;

    case 86: // V key // downscore player 2
      // scoreDown(2);
      break;

    case 32: // up arrow key // pause
      if (!isPaused) {
        stopCountDown();
      }
      else {
        if (whoHasBuzzed == 1) {
          player1CanBuzz = false;
          player2CanBuzz = true;
          $('#buzzerImgContainer').css({"display" : "none"});
          highlightPlayer(1);
        }
        else if (whoHasBuzzed == 2) {
          player1CanBuzz = true;
          player2CanBuzz = false;
          $('#buzzerImgContainer').css({"display" : "none"});
          highlightPlayer(2);
        }
        startCountDown(distance);
      }
      break;

    case 81: // Q key || player 1 buzzer
        hasBuzzed(1);
        break;

    case 77: // M key || player 2 buzzer
        hasBuzzed(2);
        break;
    }
    // add skip when no one finds that displays something mean
});


var countDown = document.getElementById("countDown");

var distance;
var x;

function startCountDown(t) {
  isPaused = false;

  // Set the date we're counting down to
  var d = new Date();
  var countDownDate = d.setTime(d.getTime() + t);

  // Update the count down every 10 milliseconds
  x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date

  distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  var centiemes = Math.floor((distance % 1000) / 10);
  var milliseconds = distance;

  // Display the result in the element
  document.getElementById("countDown").innerHTML = "0"+seconds+":"+centiemes;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countDown").innerHTML = "VOUS ÊTES NAZES";
    distance = 0;
    startGame();
    }
  }, 10);
}

function stopCountDown() {
  clearInterval(x);
  isPaused = true;
  return distance;
}
