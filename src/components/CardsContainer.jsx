/* eslint-disable */

export const CardsContainer = ({ children, optionSelected, className }) => {

  const componentClass = `${ className }${ optionSelected ? ' hide' : ''}`

  return (
    <section className={ componentClass }>
      { children }
    </section>
  )
}
