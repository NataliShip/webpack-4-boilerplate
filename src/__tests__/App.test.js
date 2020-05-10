import { shallow } from 'enzyme'
import React from 'react'
import faker from 'faker'
import App from 'components/App'

describe('App component', () => {
  let props, appComponent

  beforeEach(() =>
    props = {
      name: faker.random.words()
    })

  describe('Given the component has been rendered', () => {
    beforeEach(() => {
      appComponent = shallow(<App {...props} />)
    })

    it('Then .app should be displayed', () => {
      expect(appComponent.find('.app').length).toBe(1)
    })
  })
})
