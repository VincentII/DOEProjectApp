import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { View, TextView } from 'react-native' // eslint-disable-line no-unused-vars
import { Provider } from 'react-redux' // eslint-disable-line no-unused-vars
import Navigation from './navigation' // eslint-disable-line no-unused-vars
import  store  from './js/store'

export default class App extends Component {
  state = {
      curUser: null
  }

  componentDidMount () {
  }

  render () {
      return (
        <Provider store={store}>
          <Navigation />
        </Provider>
      )
  }
}
