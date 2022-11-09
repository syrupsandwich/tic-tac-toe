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
  };
  
  const endTurn = () => {
    if(player2.automated){
    let options = [];
    allCells.forEach((cell)=>{
      if(cell.textContent === '' && cell.id !== ''){
        options.push(cell.id) }
      });
    player2.move(options);
    }
  }

  const rangeInput = document.querySelector('input');
  const output = document.querySelector('output');
  const resetBtn = document.querySelector('.reset');

  resetBtn.addEventListener('click', function(){
    resetGrid(output.value.charAt(0));
    gameOver = false;
  });

  function setDefaultState(){
    output.value = `${rangeInput.value} * ${rangeInput.value}`;
  };
  
  rangeInput.addEventListener('input', function(){
    output.value = `${this.value} x ${this.value}`;
  });

  document.addEventListener('DOMContentLoaded', function(){
    setDefaultState();
  });

  return { grid, markCell, endTurn};
})();

const player = (mark, isBot = false) => {
  gameboard.grid.addEventListener('click', (e) => {
    if(e.target.parentNode !== gameboard.grid){ return };
    if(e.target.textContent !== ''){ return };
    gameboard.markCell(e.target.id, player1.marker);
    gameboard.endTurn();
  });

  let marker = mark.charAt(0);
  let score = 0;

  const getScore = () => { return score };

  const point = () => { score++ };

  const automated = isBot;
  if(automated){
    const getRandomInt = (max) => { return Math.floor(Math.random() * max) };
    const move = (options) => {
      if(options.length === 0){ return };
      let randomId = getRandomInt(options.length);
      gameboard.markCell(options[randomId], player2.marker);
    }
    return { marker, point, move, automated, getScore };
  }

  return { marker, point, getScore };
};

if(!sessionStorage.player1Marker){
sessionStorage.setItem('player1Marker', prompt('Player 1, input your marker.', 'x').toUpperCase());
}
const player1 = player(sessionStorage.player1Marker);

if(!sessionStorage.player2Marker){
  sessionStorage.setItem('player2Marker', prompt('Player 2, input your marker.', 'o').toUpperCase());
  }
const player2 = player(sessionStorage.player2Marker, true);
