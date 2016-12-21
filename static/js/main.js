var score;
var notiTimer = 0;

function init() {
  score = 10000;
}

var notiMessages = [
  'I\'m intimidated by the fear of being average.',
  'Just be yourself, there is no one better.',
  'I never want to change so much that people can\'t recognize me.',
  'I suffer from girlnextdooritis where the guy is friends with you and that\'s it',
  'People are people and sometimes we change our minds.',
  'Darling, I’m a nightmare dressed like a daydream.',
  'I could dance to this beat forevermore.',
  'I make the moves up as I go.',
  'This is the golden age of something good and right and real.'
];

var welcomePanel = document.querySelector('.welcome');

var curLevel = document.querySelector('.current-level');
var curLevelPara = document.querySelector('.character p');

var uiImage = document.querySelector('img.yourself');
var currentImage = 'ready';
var updateImage = 'ready';

var btnStart = document.querySelector('.start');
var btnScore = document.querySelectorAll('.button-bar button');

for(i = 0; i < btnScore.length; i++) {
  btnScore[i].onclick = function(e) {
    var scoreMod = e.target.getAttribute('data-score');
    var scoreNum = Number(scoreMod);
    
    app.socket.emit("add:score", scoreNum);
  };
}



Notification.requestPermission().then(function(result) {
  console.log(result);
});


function updateProgressBar() {
  curLevel.style.width = score + '%';
  curLevelPara.textContent = 'Level: ' + score + '%';
}

// update images

function updateDisplay() {
  if(score <= 20) {
    currentImage = 'chill';
  } else if(score > 20 && score <= 40) {
    currentImage = 'happy';
  } else if(score > 40 && score <= 80) {
    currentImage = 'sad';
  } else if(score > 80) {
    currentImage = 'ready';
  }

  if(updateImage !== currentImage) {
    uiImage.src = '/static/img/' + currentImage + '.png';
    updateImage = currentImage;
  }

  updateProgressBar();
}

function endScreen() {
  welcomePanel.style.zIndex = '1';
}

// function main() {
//   score -= 3;
//   notiTimer += 1;
//   updateDisplay();
//   if(score <= 0) {
//     score = 0;
//     endScreen();
//   } else {
//     if(notiTimer % 500 === 0) {
//       randomNotification();
//     }
//
//     window.requestAnimationFrame(main);
//   }
// }

$(function() {
  app.socket.on("health", function (health) {
    score = health;

    updateDisplay();

    if (score == 0) {
      endScreen();
    }
  });
});