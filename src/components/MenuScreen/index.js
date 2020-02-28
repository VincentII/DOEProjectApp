import React, { Component} from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert,BackHandler} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'

class MenuScreen extends Component {
    
    constructor(props) {
        super(props);

        this.ref = firebase.database().ref().child("users").child(this.props.user.id).child("devices");
        this.unsubscribe = null;
        this.state = {
          isLoading: false,
          devices:[],
        };
    }
    componentDidMount() {
      this.unsubscribe = this.ref.on('value',this.onCollectionUpdate);
      
    }

    onCollectionUpdate = (querySnapshot) => {
      const raw = querySnapshot;

      this.setState({
        isLoading: true,
        }); 
      

      const devices = []

      this.setState({devices})

      const out = this;
      raw.forEach(function(child){
        let deviceRef = firebase.database().ref().child("devices/"+child.key);
        deviceRef.once('value').then(deviceSnap =>{
        
        
        var d = {id:deviceSnap.key,currentGoat:deviceSnap.val().current_goat}

        devices.push(d) 
        
        console.log(devices)

        out.setState({
          devices
        });
      })

      })
      

      this.setState({
        isLoading: false,
      });
    }
    
    

    OnPressDeviceButton = (id,goat) => {
 
      var dev = {id,goat}
      this.props.setCurrentDevice(dev);
      this.props.navigation.navigate('Device',{});
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
                  <Text style={styles.title}>Your Devices</Text>
                </View>
                
                <ScrollView style={styles.subContainer}>
                  {/* <Text>{this.state.devices}</Text> */}
                  {
                    this.state.devices.length ==0?
                    <Text>No devices found, click add device.</Text> :
                    this.state.devices.map((item, i) => (
                      <Button 
                        buttonStyle={styles.clearButton} 
                        titleStyle={styles.clearButtonText} 
                        key={i} 
                        title={"[ID: "+item.id + "] " +item.currentGoat}
                        onPress = {
                          () => this.OnPressDeviceButton(item.id,item.currentGoat)
                        }
                        >
                      </Button>
                    ))
                  }
                </ScrollView>
              </View>
            )
          }
    }
}


const mapStateToProps = state => ({
  currentDevice: state.currentDevice,
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    setCurrentDevice: (device) => dispatch(setCurrentDevice(device))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  MenuScreen)
