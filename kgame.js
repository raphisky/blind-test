
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

// Start Game
var level = 0;

function startGame() {
  resetBuzzers();
  startCountDown(timeAvailable);
  displayImg(level);
  level += 1;
  console.log(level);
  return level;
}

// Get dom elements

var startGameButton = document.getElementById("startGame");
var displayedImg = document.getElementById("displayedImg");
var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");
var zoneScorePlayer1 = document.getElementById("scorePlayer1");
var zoneScorePlayer2 = document.getElementById("scorePlayer2");


startGameButton.onclick = function() {
  startGame();
};

// BUZZER

// Initial state of the game
var player1CanBuzz = true;
var player2CanBuzz = true;

var hasBuzzedPlayer_1 = false;
var hasBuzzedPlayer_2 = false;

var whoHasBuzzed;

// What happens when someone buzzes

function hasBuzzed(p) {
  if (p == 1 && player1CanBuzz) {
    stopCountDown();
    highlightPlayer(1);
    player2CanBuzz = false;
    whoHasBuzzed = p;
    return whoHasBuzzed;
  }

  else if (p == 2 && player2CanBuzz) {
    stopCountDown();
    highlightPlayer(2);
    player1CanBuzz = false;
    whoHasBuzzed = p;
    return whoHasBuzzed;
  }
}

function highlightPlayer(n) {
  var playerToHighlight = document.getElementById("zonePlayer"+n);
  playerToHighlight.classList.toggle("playerHighlighted");
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

    case 38: // up arrow key // pause
      if (!isPaused) {
        stopCountDown();
      }
      else {
        if (whoHasBuzzed == 1) {
          player1CanBuzz = false;
          player2CanBuzz = true;
          highlightPlayer(1);
        }
        else if (whoHasBuzzed == 2) {
          player1CanBuzz = true;
          player2CanBuzz = false;
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

var timeAvailable = 4000;
var distance;
var x;

function startCountDown(t) {
  isPaused = false;
  // reset distance
  // distance = timeAvailable;

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



// PROGRESS BAR
var ProgressBar = require(['progressbar.min.js']);
var line = new ProgressBar.Line('progressBarContainer');
