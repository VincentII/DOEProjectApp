import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

class DeviceScreen extends Component {
    
    constructor() {
        super();

        this.ref = firebase.database().ref().child("users").child("user_test").child("devices");
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          devices:[],
        };
    }
    componentDidMount() {
      this.unsubscribe = this.ref.on('child_added',this.onCollectionUpdate);
    }
    onCollectionUpdate = (querySnapshot) => {
      const raw = querySnapshot.key;

      if(raw==null)
      return;
      
      let deviceRef = firebase.database().ref().child("devices/"+raw);
      deviceRef.once('value').then(deviceSnap =>{
        var devices = this.state.devices;
        
        var d = {id:deviceSnap.key,currentGoat:deviceSnap.val().current_goat}

        devices.push(d) 
        
        this.setState({
            devices,
            isLoading: false,
        });

      })



     
    }

    render(){
        if(this.state.isLoading){
            return(
              <View style={styles.activity}>
                <ActivityIndicator size="large" color="#ffffff"/>
              </View>
              
          
            )
          }
          else {
            return(
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>SERIAL</Text>
                </View>
                

              </View>
            )
          }
    }
}


export default DeviceScreen;
