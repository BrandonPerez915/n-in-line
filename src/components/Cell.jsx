/* eslint-disable */

export const Cell = ({ id, currentTurn, optionSelected, drawFunction }) => {

  const className = optionSelected ? 'cell hide' : 'cell'

  const draw = () => {
    drawFunction(id)
  }

  return (
    <div className={ className }>
      <div id={ `cell-${id}` } className='piece' onClick={ draw }>

      </div>
    </div>
  )
}
