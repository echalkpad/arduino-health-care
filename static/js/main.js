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
]

var welcomePanel = document.querySelector('.welcome');

var curLevel = document.querySelector('.current-level');
var curLevelPara = document.querySelector('.character p');

var uiImage = document.querySelector('.ui img');
var currentImage = 'ready';
var updateImage = 'ready';

var btnStart = document.querySelector('.start');
var btnScore = document.querySelectorAll('.button-bar button');


btnStart.onclick = function() {
  welcomePanel.style.zIndex = '-1';
  init();
  main();
}

for(i = 0; i < btnScore.length; i++) {
  btnScore[i].onclick = function(e) {
    var scoreMod = e.target.getAttribute('data-score');
    var scoreNum = Number(scoreMod);
    score += scoreNum;
  };
}


Notification.requestPermission().then(function(result) {
  console.log(result);
});


function updateProgressBar() {
  var percent = Math.floor((score/10000) * 100);
  curLevel.style.width = percent + '%';
  curLevelPara.textContent = 'Level: ' + percent + '%';
}

// update images

function updateDisplay() {
  if(score > 10000) {
    score = 10000;
  }

  if(score <= 2000) {
    currentImage = 'chill';
  } else if(score > 2000 && score <= 4000) {
    currentImage = 'happy';
  } else if(score > 4000 && score <= 8000) {
    currentImage = 'sad';
  } else if(score > 8000) {
    currentImage = 'ready';
  }

  if(updateImage !== currentImage) {
    displayNotification('People haven \'t always been there for me but music always has, look at me!', '/static/img/' + currentImage + '.png', 'Yoda says');
    uiImage.src = '/static/img/' + currentImage + '.png';
    updateImage = currentImage;
  }

  updateProgressBar();
}


function endScreen() {
  welcomePanel.style.zIndex = '1';
  displayNotification('YOU LOSER!', '/static/img/' + currentImage + '.png', 'Yoda says');
}


function displayNotification(theBody, theIcon, theTitle) {
  var options = {
    body: theBody,
    icon: theIcon
  }
  var n = new Notification(theTitle, options);
  setTimeout(n.close.bind(n), 4000);
}

function randomNotification() {
  var randomNotiMsg = notiMessages[Math.floor(Math.random() * 10)];
  var options = {
    body: randomNotiMsg,
    icon: '/static/img/sad.png',
  }

  var n = new Notification('Yoda says', options);
  setTimeout(n.close.bind(n), 4000);
}


function main() {
  score -= 3;
  notiTimer += 1;
  updateDisplay();
  if(score <= 0) {
    score = 0;
    endScreen();
  } else {
    if(notiTimer % 500 === 0) {
      randomNotification();
    }

    window.requestAnimationFrame(main);
  }
}

