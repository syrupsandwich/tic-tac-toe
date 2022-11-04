const gameboard = (() => {
  const grid = document.querySelector('.grid');

  (function (){
    for(let i = 0; i < 9; i++){
      let cell = document.createElement('div');
      cell.id = i;
      grid.appendChild(cell);
    }
  })();

  const cells = Array.from(document.querySelector('.grid').childNodes);
  const markCell = (id, marker) => {
    cells[id].textContent = marker;
  };
  
  const endTurn = () => {
    if (player2.automated){
    let options = [];
    cells.forEach((cell)=>{ if (cell.textContent === '') { options.push(cell.id) } });
    player2.move(options);
    }
  }

  return { cells, grid, markCell, endTurn};
})();

gameboard.grid.addEventListener('click', (e) => {
  if (e.target.parentNode !== gameboard.grid) { return };
  if (e.target.textContent !== '') { return };
  gameboard.markCell(e.target.id, player1.marker);
  gameboard.endTurn();
});

const player = (mark, isBot = false) => {
  let marker = mark.charAt(0);
  let score = 0;

  const automated = isBot;
  if(automated){
    const getRandomInt = (max) => { return Math.floor(Math.random() * max) };
    const move = (options) => {
      if (options.length === 0){ return };
      gameboard.markCell(options[getRandomInt(options.length)], player2.marker);
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
