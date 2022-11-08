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
    
    requiredCells = dimension * dimension;
    for(let i = 0; i < requiredCells; ++i){
      allCells[i].id = i;
      grid.appendChild(allCells[i]);
    }

  };
  resetGrid();

  const markCell = (id, marker) => {
    allCells[id].textContent = marker;
  };
  
  const endTurn = () => {
    if (player2.automated){
    let options = [];
    allCells.forEach((cell)=>{
      if (cell.textContent === '' && cell.id !== '') {
        options.push(cell.id) }
      });
    player2.move(options);
    }
  }

  const rangeInput = document.querySelector('input');
  const output = document.querySelector('output');
  const resetBtn = document.querySelector('.reset');

  resetBtn.addEventListener('click', function() {
    resetGrid(output.value.charAt(0));
  });

  function setDefaultState() {
    output.value = `${rangeInput.value} * ${rangeInput.value}`;
  };
  
  rangeInput.addEventListener('input', function() {
    output.value = `${this.value} x ${this.value}`;
  });

  document.addEventListener('DOMContentLoaded', function() {
    setDefaultState();
  });

  return { grid, markCell, endTurn};
})();

const player = (mark, isBot = false) => {
  gameboard.grid.addEventListener('click', (e) => {
    if (e.target.parentNode !== gameboard.grid) { return };
    if (e.target.textContent !== '') { return };
    gameboard.markCell(e.target.id, player1.marker);
    gameboard.endTurn();
  });

  let marker = mark.charAt(0);
  let score = 0;

  const automated = isBot;
  if(automated){
    const getRandomInt = (max) => { return Math.floor(Math.random() * max) };
    const move = (options) => {
      if (options.length === 0){ return };
      let randomId = getRandomInt(options.length);
      gameboard.markCell(options[randomId], player2.marker);
    }
    return { marker, score, move, automated};
  }

  return { marker, score };
};

if(!sessionStorage.player1Marker){
sessionStorage.setItem('player1Marker', prompt('Player 1, input your marker.', 'x'));
}
const player1 = player(sessionStorage.player1Marker);

if(!sessionStorage.player2Marker){
  sessionStorage.setItem('player2Marker', prompt('Player 2, input your marker.', 'o'));
  }
const player2 = player(sessionStorage.player2Marker, true);
