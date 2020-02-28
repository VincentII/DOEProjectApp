import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { View, TextView } from 'react-native' // eslint-disable-line no-unused-vars
import { Provider } from 'react-redux' // eslint-disable-line no-unused-vars
import Navigation from './navigation' // eslint-disable-line no-unused-vars
import  store  from './js/store'

import { PersistGate } from 'redux-persist/lib/integration/react';

// import the two exports from the last code snippet.
import { persistor } from './js/store';

export default class App extends Component {
  state = {
      curUser: null
  }

  componentDidMount () {
  }

  render () {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Navigation />
          </PersistGate>
        </Provider>
      )
  }
}
