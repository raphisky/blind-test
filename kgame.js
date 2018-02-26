
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
    console.log(scorePlayer1);
    return scorePlayer1;
  }
  else if (player == "2") {
    scorePlayer2 += 1;
    zoneScorePlayer2.textContent = scorePlayer2;
    console.log(scorePlayer2);
    return scorePlayer2;
  }

};


///////////////////////////////////

$(document).keydown(function(e) {
    switch (e.which) {
    case 37: //left arrow key
      scoreUp(1);
      nextLevel();
      break;
    case 39: //right arrow key
      scoreUp(2);
      nextLevel();
      break;
    }
});

var countDownZone = document.getElementById("countDownZone");
var timeRemaining = 10;

function countDown() {
  timeRemaining -= 1;
  countDownZone.textContent = timeRemaining;
  console.log(timeRemaining);
  return timeRemaining;
}




// une touche pour mettre FAUX / VOUS ETES DES MERDES


// Load images


//
