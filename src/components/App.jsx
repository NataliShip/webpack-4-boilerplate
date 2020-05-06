import React from 'react'
import PropTypes from 'prop-types'

const App = ({name}) => {
  return (
    <div>
      { `Приложение ${name} запущено!` }
    </div>
  )
}

App.propTypes = {
  name: PropTypes.string.isRequired
}

export default App
