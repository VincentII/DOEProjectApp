import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';
import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'

class DeviceScreen extends Component {
    
    constructor(props) {
        super(props);


        this.state = {
          isLoading: false,
          devices:[],
        };
    }
    componentDidMount() {

    }

    OnShowGraphs = (event) => {
 
      this.props.navigation.navigate('Graph',{});
    }

    OnRemoveDevicePress= (event) => {
 
      Alert.alert(
        '[WARNING] Are you sure you want to Remove the Device?',
        'You are removing the device from your account. You can add the device again anytime in the "Add Device" screen.',
        [
          {text: 'OK', onPress: () => this.RemoveDevice()},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          
        ],
        {cancelable: true},
      )
    }
    
    RemoveDevice = () =>{
      // let userRef = firestore.database().ref('users/' + this.props.user.id+"/devices/"+this.props.currentDevice.referenceKey);
      // userRef.remove()

      let userRef = firestore.collection("users").doc(this.props.user.id);


      console.log(this.props.currentDevice.referenceKey);
      const removeRes = userRef.update({
        
        devices: firebase.firestore.FieldValue.arrayRemove(this.props.currentDevice.referenceKey)
      });

      Alert.alert("Removed Device Successfully!")
      this.props.navigation.goBack();

      
    }

    render(){
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.title}>{this.props.currentDevice.id}</Text>
              
              <Text style={styles.subTitle}>{"Connected Goat: "+this.props.currentDevice.goat}</Text>
              <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Show Graphs"}
              onPress = {
                () => this.OnShowGraphs()
              }
              >
            </Button>
          </View>
            <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"REMOVE Device"}
              onPress = {
                () => this.OnRemoveDevicePress()
              }
              >
            </Button>
          
        </View>
      )
          
    }
}


const mapStateToProps = state => ({
  user: state.user,
  currentDevice: state.currentDevice
})

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DeviceScreen)
