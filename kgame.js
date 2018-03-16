
// Get the images
var imgs = [];

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

var startGameButton = document.getElementById("startGame");
var nextGameButton = document.getElementById("nextGame");
var displayedImg = document.getElementById("displayedImg");
var imgUrl;
var level = 0;

function extractImgUrlFromDict(key) {
  var imgToExtract = imgs[key].value;
  imgUrl = imgToExtract.substr(0,imgToExtract.indexOf(" ",0));
  console.log(imgUrl);
  return imgUrl;
}

function displayImg(key) {
  extractImgUrlFromDict(key);
  displayedImg.setAttribute("src",imgUrl);
}

startGameButton.onclick = function() {
  displayImg(0);
  level += 1;
  startCountDown(timeAvailable);
  return level;
};

function nextLevel() {
  level += 1;
  displayImg(level);
  return level;
}

var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");

player1.onclick = function() {
  scoreUp(1);
  nextLevel();
}

player2.onclick = function() {
  scoreUp(2);
  nextLevel();
}


var scorePlayer1 = 0;
var scorePlayer2 = 0;

var zoneScorePlayer1 = document.getElementById("scorePlayer1");
var zoneScorePlayer2 = document.getElementById("scorePlayer2");


function scoreUp(player) {
  if (player == "1") {
    scorePlayer1 += 1;
    zoneScorePlayer1.textContent = scorePlayer1;
    return scorePlayer1;
  }
  else if (player == "2") {
    scorePlayer2 += 1;
    zoneScorePlayer2.textContent = scorePlayer2;
    return scorePlayer2;
  }

};


///////////////////////////////////

var isPaused = false;

$(document).keydown(function(e) {
    switch (e.which) {
    case 37: //left arrow key // score player 1
      scoreUp(1);
      resetBuzzers();
      highlightPlayer(1);
      nextLevel();
      stopCountDown();
      startCountDown(timeAvailable);
      break;

    case 39: //right arrow key // score player 2
      scoreUp(2);
      resetBuzzers();
      highlightPlayer(2);
      nextLevel();
      stopCountDown();
      startCountDown(timeAvailable);
      break;

    case 38: // up arrow key
      if (!isPaused) {
        stopCountDown();
      }
      else {
        startCountDown(distance);
      }
      break;

    case 81: // Q key || player 1 buzzer
      if (!isPaused && player1CanBuzz) {
        isPaused = true;
        cantBuzz();
        stopCountDown();
        highlightPlayer(1);
      }
      else {
      }
      break;

      case 77: // M key || player 2 buzzer
        if (!isPaused && player2CanBuzz) {
          isPaused = true;
          cantBuzz();
          stopCountDown();
          highlightPlayer(2);
        }
        else {
        }
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
  var milliseconds = distance;

  // Display the result in the element
  document.getElementById("countDown").innerHTML = seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countDown").innerHTML = "VOUS ÊTES NAZES";
    distance = 0;
    nextLevel();
    startCountDown(timeAvailable);
    }
  }, 10);
}

function stopCountDown() {
  clearInterval(x);
  isPaused = true;
  return distance;
}

function skipLevel() {

}



// BUZZER

function highlightPlayer(n) {
  var playerToHighlight = document.getElementById("zonePlayer"+n);
  playerToHighlight.classList.toggle("playerHighlighted");
}

var player1CanBuzz = true;
var player2CanBuzz = true;

function resetBuzzers() {
  player1CanBuzz = true;
  player2CanBuzz = true;
}

function cantBuzz() {
  player1CanBuzz = false;
  player2CanBuzz = false;
}
