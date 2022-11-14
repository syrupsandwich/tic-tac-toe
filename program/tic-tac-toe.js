const gameboard = (() => {
  const grid = document.querySelector('.grid');
  const maxCells = 81;
  const allCells = [];
  for (let i = 0; i < maxCells; i ++){
    allCells.push(document.createElement('div'));
  }

  const resetGrid = (dimension = 3) => {
    grid.style.setProperty('--grid-dimension', dimension);

    if(grid.childElementCount > 0){
      allCells.forEach(element => { 
        element.textContent = '';
        element.id = '';
        element.removeAttribute('class');
        element.remove();
      });
    }

    assignRowNumber = (i) => {
        let number = Math.floor(i / dimension);
        allCells[i].setAttribute('data-row', number);
    };

    assignColNumber = (i) => {
      let number = (i -(dimension * (Math.floor(i / dimension))));
      allCells[i].setAttribute('data-column', number);
    };

    assignDiagonal1 = (i) => {
      let number = +allCells[i].getAttribute('data-column') - +allCells[i].getAttribute('data-row');
      allCells[i].setAttribute('data-diagonal1', number);
    };

    assignDiagonal2 = (i) => {
      let number = +allCells[i].getAttribute('data-column') + +allCells[i].getAttribute('data-row');
      allCells[i].setAttribute('data-diagonal2', number);
    };

    requiredCells = (dimension * dimension);
    for(let i = 0; i < requiredCells; ++i){
      allCells[i].id = i;
      assignRowNumber(i);
      assignColNumber(i);
      assignDiagonal1(i);
      assignDiagonal2(i);
      grid.appendChild(allCells[i]);
    }

  };

  resetGrid();

  let gameOver = false;
  
  const highlightPattern = (cells) => {
    cells.forEach((cell) => { cell.classList.add('highlight-row') });
  };

  let winningNumber = 3;

  const checkPatterns = (attribute, id, marker) => {
    let group = allCells[id].getAttribute(`${attribute}`);
    let attributeSelection = `[${attribute}='${group}']`;
    let cells = Array.from(document.querySelectorAll(attributeSelection));
    let points = 0;
    let pattern = [];
    cells.forEach((cell) => {
      if(cell.textContent === marker){ 
        points++;
        pattern.push(cell);
      };
      if(cell.textContent !== marker || cell.className === 'highlight-row'){
        points = 0;
        pattern = [];
      };
      if(points === winningNumber){ 
        highlightPattern(pattern);
        rewardPlayer(marker);
        gameOver = true;
        return;
      };
    });
  };

  const p1Score = document.querySelector('.p1-score');
  const p2Score = document.querySelector('.p2-score');
  
  const rewardPlayer = (marker) => {
    if(marker === player1.marker){
      player1.point();
      p1Score.textContent = player1.getScore();
    };
    if(marker === player2.marker){
      player2.point();
      p2Score.textContent = player2.getScore();
    };
  };

  
  const markCell = (id, marker) => {
    if(gameOver){ return };
    allCells[id].textContent = marker;
    checkPatterns('data-row', id, marker);
    checkPatterns('data-column', id, marker);
    checkPatterns('data-diagonal1', id, marker);
    checkPatterns('data-diagonal2', id, marker);
    lastMark = marker;
  };
  
  const p1Label = document.querySelector('.p1-marker');
  const p2Label = document.querySelector('.p2-marker');
  let lastMark;
  
  const endTurn = () => {
    if(player2.automated){
    let options = [];
    allCells.forEach((cell)=>{
      if(cell.textContent === '' && cell.id !== ''){
        options.push(cell.id) }
      });
    player2.move(options);
      lastMark = player2.marker;
    } else {
      if(lastMark === player1.marker){
        p2Label.classList.add('highlight');
        p1Label.classList.remove('highlight');
      } else if(lastMark === player2.marker){
        p1Label.classList.add('highlight');
        p2Label.classList.remove('highlight');
      };
    }
  }

  const patternDisplay = document.querySelector('.pattern');
  
  const updatePatternRequirement = (number) => {
    winningNumber = number;
    patternDisplay.textContent = number;
  }

  const rangeInput = document.querySelector('input');
  const output = document.querySelector('output');
  const resetBtn = document.querySelector('.reset');
  const playVsDummyInput = document.querySelector('#compete-vs-dummy');
  const playVsP2Input = document.querySelector('#compete-vs-player');
  const p1NameInput = document.querySelector('#p1-name');
  const p2NameInput = document.querySelector('#p2-name');

  resetBtn.addEventListener('click', function(){
    resetGrid(output.value.charAt(0));
    if(requiredCells > 9){ updatePatternRequirement(4) };
    if(requiredCells === 9){ updatePatternRequirement(3) };
    if(p1NameInput.value !== ''){
      p1Label.textContent = p1NameInput.value;
      sessionStorage.player1Marker = p1NameInput.value;
      player1.marker = p1NameInput.value.charAt(0).toUpperCase();
      lastMark = player2.marker;
    };
    if(p2NameInput.value !== ''){
      p2Label.textContent = p2NameInput.value;
      sessionStorage.player2Marker = p2NameInput.value;
      player2.marker = p2NameInput.value.charAt(0).toUpperCase();
      lastMark = player2.marker;
    };
    if(playVsDummyInput.checked){
      player2.automated = true;
      if(!singlePlayer){
      resetScore();
      };
      singlePlayer = true;
      p1Label.classList.add('highlight');
      p2Label.classList.remove('highlight');
    };
    if(playVsP2Input.checked){
      player2.automated = false;
      if(singlePlayer){
        lastMark = player2.marker;
        resetScore();
      };
      singlePlayer = false;
    };
    gameOver = false;
  });

  const resetScore = () => {
    p1Score.textContent = '0';
    player1.resetScore();
    p2Score.textContent = '0';
    player2.resetScore();
  };

  function setDefaultState(){
    output.value = `${rangeInput.value} * ${rangeInput.value}`;
  };
  
  rangeInput.addEventListener('input', function(){
    output.value = `${this.value} x ${this.value}`;
  });

  document.addEventListener('DOMContentLoaded', function(){
    setDefaultState();
    lastMark = player2.marker;
  });

  let singlePlayer = true;

  const getNextMark = () => {
    if(singlePlayer){ return player1.marker };
    if(lastMark === player1.marker){ return player2.marker };
    if(lastMark === player2.marker){ return player1.marker };
  }

  grid.addEventListener('click', (e) => {
    if(e.target.parentNode !== gameboard.grid){ return };
    if(e.target.textContent !== ''){ return };
    gameboard.markCell(e.target.id, getNextMark());
    gameboard.endTurn();
  });

  return { grid, markCell, endTurn, p1Label, p2Label };
})();

const player = (mark , automated = false) => {

  let marker = mark.charAt(0).toUpperCase();
  let score = 0;

  const getScore = () => { return score };

  const point = () => { score++ };

  const resetScore = () => {
    score = 0;
  };

  if(automated){
    const getRandomInt = (max) => { return Math.floor(Math.random() * max) };
    const move = (options) => {
      if(options.length === 0){ return };
      let randomId = getRandomInt(options.length);
      gameboard.markCell(options[randomId], player2.marker);
    }
    return { marker, point, move, automated, getScore, resetScore };
  }

  return { marker, point, getScore, resetScore };
};

if(!sessionStorage.player1Marker){
sessionStorage.setItem('player1Marker', 'X');
}
gameboard.p1Label.textContent = sessionStorage.player1Marker;
const player1 = player(sessionStorage.player1Marker);

if(!sessionStorage.player2Marker){
  sessionStorage.setItem('player2Marker', 'O');
}
gameboard.p2Label.textContent = sessionStorage.player2Marker;
const player2 = player(sessionStorage.player2Marker, true);
