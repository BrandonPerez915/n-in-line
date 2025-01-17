import { Card } from './components/Card.jsx'
import { CardsContainer } from './components/CardsContainer.jsx'
import { Cell } from './components/Cell.jsx'

import { useState, useEffect } from 'react'

import { OPTIONS, TURNS } from './utils/constants.js'

function App() {

  //Estados
  const [optionSelect, setOptionSelect] = useState(false)

  const [mode, setMode] = useState(null)

  const [board, setBoard] = useState(null)

  const [turn, setTurn] = useState(TURNS[0])

  const changeCardState = (num) => {
    setOptionSelect(!optionSelect)
    setMode(num)
  }

  const showOptions = () => {
    setOptionSelect(false)
  }

  const generateBoard = (n) => {
    const board = Array(n).fill(null).map(() => Array(n).fill(null))
    return board
  }

  useEffect(() => {
    const gameBoard = document.querySelector('.game-board')
    gameBoard.style.gridTemplateColumns = `repeat(${mode}, 1fr)`
    setBoard(generateBoard(mode));
  }, [mode])

  function draw(index) {
    let currentColumn = index % mode

    //se posiciona la pieza en la fila mas baja posible, en caso de 
    //que la columna este llena, no se hace nada
    for(let i = mode - 1; i >= 0; i--) {
      if(board[i][currentColumn] === null) {
        //copia del board
        let newBoard = board.map(row => [...row])
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

    for(let i = 0; i < mode; i++) {
      let currentIndex = mode ** 2 - (mode - i)
      for(let j = mode - 1; j >= 0; j--) {
        const cell = document.getElementById(`cell-${currentIndex}`)
        if(board[j][i] === 'r') {
          cell.style.backgroundColor = 'var(--red)'
        }
        else if(board[j][i] === 'b') {
          cell.style.backgroundColor = 'var(--light-blue)'
        }
      }
    }
  }

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

      </footer>
    </main>
  )
}

export default App
