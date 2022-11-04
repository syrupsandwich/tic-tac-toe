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
  
  return { cells, grid, markCell };
})();

gameboard.grid.addEventListener('click', (e) => {
  if (e.target.parentNode !== gameboard.grid) { return };
  if (e.target.textContent !== '') { return };
  gameboard.markCell(e.target.id, 'x');
});
