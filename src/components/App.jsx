import React from 'react'
import PropTypes from 'prop-types'
import logo from 'assets/logo.png'
import css from './app.module.sass'

const App = ({name}) => {
  return (
    <div className={css.root}>
      {`Приложение ${name} запущено!`}
      <img className={css.img} src={logo} alt='Test logo' />
    </div>
  )
}

App.propTypes = {
  name: PropTypes.string.isRequired
}

export default App
