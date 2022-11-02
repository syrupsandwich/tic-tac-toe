(function (){
  let grid = document.querySelector('.grid');
  for(let i = 0; i < 9; i++){
    let cell = document.createElement('div');
    cell.id = i;
    grid.appendChild(cell);
  }
})();
