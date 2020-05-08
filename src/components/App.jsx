import React from 'react'
import PropTypes from 'prop-types'
import logo from 'assets/logo.png'

const App = ({name}) => {
  return (
    <div>
      { `Приложение ${name} запущено!` }
      <img src={logo} alt='Test logo'/>
    </div>
  )
}

App.propTypes = {
  name: PropTypes.string.isRequired
}

export default App
