import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import StartScreen from '../components/StartScreen';
import MenuScreen from '../components/MenuScreen';

import DeviceScreen from '../components/DeviceScreen';
import DeviceEditScreen from '../components/DeviceEditScreen';

import AddDeviceScreen from '../components/AddDeviceScreen';

import GraphScreen from '../components/GraphScreen';
import TableScreen from '../components/TableScreen';
import HistoryScreen from '../components/HistoryScreen';

import ProfileScreen from '../components/ProfileScreen';
import ProfileEditScreen from '../components/ProfileScreen/ProfileEditScreen';

// import BoardScreen from './components/BoardScreen';
// import BoardDetailScreen from './components/BoardDetailScreen';
// import AddBoardScreen from './components/AddBoardScreen';
// import EditBoardScreen from './components/EditBoardScreen';

const RootStack = createStackNavigator(
  {
    Start:StartScreen,
    Menu: MenuScreen,
    AddDevice: AddDeviceScreen,

    Device: DeviceScreen,
    DeviceEdit:DeviceEditScreen,
    
    Graph: GraphScreen,
    Table: TableScreen,
    History: HistoryScreen,

    Profile: ProfileScreen,
    
    ProfileEdit: ProfileEditScreen,
    
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
let Navigation = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return (
        <Navigation />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
