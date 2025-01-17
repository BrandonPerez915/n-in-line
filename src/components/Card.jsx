/* eslint-disable */

export const Card = ({ text, num, hideFunction, optionSelected }) => {

  const className = optionSelected ? 'card hide' : 'card'

  const getSelection = () => {
    hideFunction(num)
  }

  return (
    <div className={ className } onClick= { getSelection }>
      { text }
    </div>
  )
}
