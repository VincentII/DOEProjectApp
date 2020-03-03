import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'


import firebase from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'

import {logoutUser} from '../../js/actions'

class ProfileScreen extends Component {
    
  
    constructor(props) {
        super(props);

    }

    static navigationOptions = ({ navigation }) => {
      return {
        title: 'User Profile',
        
      };
    };

    componentDidMount() {

    }

    OnLogOutPress = () =>{
      Alert.alert(
        'Log Out?',
        "Are you sure you want to Logout?",
        [
          {text: 'OK', onPress: () => this.LogOut()},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          
        ],
        {cancelable: true},
      )
    }

    LogOut = () =>{
      this.props.logoutUser();
      this.props.navigation.popToTop();
    }

    render(){
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
          
            <Text style={styles.subTitle}>{"Name: "+(this.props.user?this.props.user.name:"")}</Text>
            <Text style={styles.subTitle}>{"Email: "+(this.props.user?this.props.user.email:"")}</Text>
            <Button 
            buttonStyle={styles.clearButton} 
            titleStyle={styles.clearButtonText} 
            title={"Log Out"}
            onPress = {
              () => this.OnLogOutPress()
            }
            >
            </Button>
          </View>
        </View>
      )
          
    }
}


const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(logoutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProfileScreen)
