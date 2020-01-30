import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import StartScreen from './components/StartScreen';
import MenuScreen from './components/MenuScreen';
// import BoardScreen from './components/BoardScreen';
// import BoardDetailScreen from './components/BoardDetailScreen';
// import AddBoardScreen from './components/AddBoardScreen';
// import EditBoardScreen from './components/EditBoardScreen';

const RootStack = createStackNavigator(
  {
    Start:StartScreen,
    Menu: MenuScreen,
    // Survey: SurveyScreen,
    // Results: ResultsScreen,
    // Board: BoardScreen,
    // BoardDetails: BoardDetailScreen,
    // AddBoard: AddBoardScreen,
    // EditBoard: EditBoardScreen,
  },
  {
    initialRouteName: 'Start',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#ffff',
      },
      headerTintColor: '#448877',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  },
);

export default createAppContainer(RootStack);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
