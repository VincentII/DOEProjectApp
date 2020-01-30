import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

class MenuScreen extends Component {
    constructor() {
        super();

        this.ref = firebase.database().ref().child("users").orderByChild("email").equalTo("b2vincent@gmail.com");
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          devices:[],
        };
    }
    componentDidMount() {
      this.unsubscribe = this.ref.on('value',this.onCollectionUpdate);
    }
    onCollectionUpdate = (querySnapshot) => {
      const raw = querySnapshot.val();

      const keys = Object.keys(raw);
      
      const devices = Object.values(raw[keys[0]].devices)

      // for(var i = 0; i<keys.length;i++){
      //   var k = keys[i]
      //   devices.push(raw[k]);
      // }



      this.setState({
        devices,
        isLoading: false,
     });
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
                  <Text style={styles.title}>Menu</Text>
                </View>
                
                <Text style={styles.inputStyle}>All data from raw_data loaded below:</Text>
                <ScrollView style={styles.subContainer}>
                  {/* <Text>{this.state.devices}</Text> */}
                  {
                    
                    this.state.devices.map((item, i) => (
                      <Button key={i} title={item}>
                      </Button>
                    ))
                  }
                </ScrollView>
              </View>
            )
          }
    }
}


export default MenuScreen;
