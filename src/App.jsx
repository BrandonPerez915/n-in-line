import { Card } from './components/Card.jsx'
import { CardsContainer } from './components/CardsContainer.jsx'
import { Cell } from './components/Cell.jsx'

import { useState, useEffect } from 'react'

import { OPTIONS, TURNS } from './utils/constants.js'

//Registro de celdas coloreadas para evitar duplicados y renderizaciones 
//innecesarias
let coloredRedCells = []
let coloredBlueCells = []

function App() {

  //Estados
  const [optionSelect, setOptionSelect] = useState(false)

  const [mode, setMode] = useState(null)

  const [board, setBoard] = useState([null])

  const [turn, setTurn] = useState(TURNS[0])

  const [winner, setWinner] = useState(null)

  const changeCardState = (num) => {
    setOptionSelect(!optionSelect)
    setMode(num)
  }

  const showOptions = () => {
    setOptionSelect(false)
    clearBoard()
    setTurn(TURNS[0])
    setMode(null)
    setBoard([null])
    setWinner(null)
  }

  const resetGame = () => {
    clearBoard()
    setTurn(TURNS[0])
    setBoard(generateBoard(mode))
    setWinner(null)
  }

  const generateBoard = (n) => {
    const board = Array(n).fill(null).map(() => Array(n).fill(null))
    return board
  }

  const clearBoard = () => {
    for(let currentIndex of coloredRedCells) {
      const cell = document.getElementById(`cell-${currentIndex}`)
      cell.classList.remove('red')
    }
    for(let currentIndex of coloredBlueCells) {
      const cell = document.getElementById(`cell-${currentIndex}`)
      cell.classList.remove('blue')
    }
    coloredRedCells = []
    coloredBlueCells = []
  }

  useEffect(() => {
    const gameBoard = document.querySelector('.game-board')
    gameBoard.style.gridTemplateColumns = `repeat(${mode}, 1fr)`
    setBoard(generateBoard(mode));
  }, [mode])

  function draw(index) {
    if(checkWinner(board, mode)) {
      setWinner(checkWinner(board, mode))
      return
    }

    let currentColumn = index % mode
    //copia del board
    let newBoard = board.map(row => [...row])
    //se posiciona la pieza en la fila mas baja posible, en caso de 
    //que la columna este llena, no se hace nada
    for(let i = mode - 1; i >= 0; i--) {
      if(board[i][currentColumn] === null) {
        //reemplazar el valor del turno actual
        newBoard[i][currentColumn] = turn
        //actualizar el board
        setBoard(newBoard)
        //actualizar el turno
        setTurn(turn === TURNS[0] ? TURNS[1] : TURNS[0])
        //salir en caso de encontrar un espacio vacio
        break
      }
    }
    //dibujar las piezas en el tablero
    for(let i = 0; i < mode; i++) {
      //ubicar la celda actual
      let currentIndex = mode ** 2 - (mode - i)
      //recorrer la columna de abajo hacia arriba
      for(let j = mode - 1; j >= 0; j--) {
        //se obtiene el elemento perteneciente a la celda actual
        const cell = document.getElementById(`cell-${currentIndex}`)

        if(newBoard[j][i] === 'r' && !coloredRedCells.includes(currentIndex)) {
          cell.classList.add('red')
          coloredRedCells.push(currentIndex)
        }
        else if(newBoard[j][i] === 'b' && !coloredBlueCells.includes(currentIndex)) {
          cell.classList.add('blue')
          coloredBlueCells.push(currentIndex)
        }
        currentIndex -= mode
      }
    }
  }

  function checkWinner(board, mode) {
    //funcion para verificar ganadores en las 4 direcciones posibles
    //(horizontal, vertical, diagonal derecha, diagonal izquierda)
    const checkDirection = (row, col, rowDelta, colDelta) => {
      const currentPlayer = board[row][col];

      //si la celda actual esta vacia, no puede haber ganador en esa celda
      if (currentPlayer === null) return false;
  
      //verificar celdas consecutivas
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowDelta;
        const newCol = col + i * colDelta;
  
        //Delimitación del tablero
        if (
          newRow < 0 || newRow >= mode || //limites verticales
          newCol < 0 || newCol >= mode || //limites horizontales
          board[newRow][newCol] !== currentPlayer //colores no consecutivos
        ) {
          return false;
        }
      }
      return true;
    };
    
    //recorrido por toda la matriz
    for (let row = 0; row < mode; row++) {

      for (let col = 0; col < mode; col++) {

        //verificar las 4 direcciones posibles
        if (
          checkDirection(row, col, 0, 1) || //horizontal
          checkDirection(row, col, 1, 0) || //vertical
          checkDirection(row, col, 1, 1) || //diagonal derecha
          checkDirection(row, col, 1, -1)   //diagonal izquierda
        ) {
          return board[row][col]; //ganador
        }
      }
    }
    return null;
  }

  //Renderizado
  return (
    <main className='board'>
      <header className='board-header'>
        <button 
          className='select-mode-button'
          onClick={ showOptions }
        >
          Select game mode
        </button>
      </header>
      <CardsContainer 
        className='select-game-menu' 
        optionSelected ={ optionSelect }
      >
        {
          OPTIONS.map((option, index) => {
            return <Card 
                key={ index } 
                text={ option }
                num={ index + 5 }
                hideFunction={ changeCardState }
                optionSelected ={ optionSelect }
              />
          })
        }
      </CardsContainer>
      <CardsContainer
        className='game-board'
        optionSelected={ !optionSelect }
      >
        {
          mode && Array(mode ** 2).fill().map((_, index) => {
            return <Cell 
              id={ index }
              key={ index }
              optionSelected={ !optionSelect }
              drawFunction={ draw }
              currentTurn={ turn }
            />
          })
        }
      </CardsContainer>
      <footer>
        <button
          className='reset-button'
          onClick={ resetGame }
        >
          Reset game
        </button>
        <div className='current-turn-card'>
          { winner &&
            <p>{ winner === 'r' ? 'Red' : 'Blue' } wins!</p>
          }
        </div>
      </footer>
    </main>
  )
}

export default App
