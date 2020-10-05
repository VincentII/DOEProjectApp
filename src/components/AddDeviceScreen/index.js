import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'


import firebase from '../../../config/firebase';
import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'



class AddDeviceScreen extends Component {
    
  
    constructor(props) {
        super(props);


        this.state = {
          isLoading: false,

          deviceID:"",
        };
    }

    static navigationOptions = ({ navigation }) => {
      return {
        title: '+ Add Device',
        
      };
    };

    componentDidMount() {

    }

    AddDevice = () =>{

      if(this.state.deviceID == ""){
        Alert.alert("Please input the ID of the device.");
        return;
      }

      let out = this;

      let deviceRef = firestore.collection("devices").doc(this.state.deviceID);

      deviceRef.get().then(deviceSnap =>{
        
        if(deviceSnap.data()!=null){
          Alert.alert("Successfully Added Device!")

          var ref = firestore.collection('users').doc(this.props.user.id);


          ref.update({
            devices: firebase.firestore.FieldValue.arrayUnion(deviceRef)
          }).then(addedDevice => {
              Alert.alert("Device: "+out.state.deviceID+", was added!");
              out.props.navigation.goBack();
          })
          
        
        }
        else
          Alert.alert("No Devices with this ID was found in the Database")
      })

      
    }


    render(){
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
          
            <Text style={styles.title}>{"Add a device"}</Text>
            <Text></Text><Text></Text><Text></Text>
            <Text style={styles.inputStyle}>Device ID</Text>
            <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({deviceID:text})} value={this.state.deviceID}/>
            <Button 
            buttonStyle={styles.clearButton} 
            titleStyle={styles.clearButtonText} 
            title={"Add Device"}
            onPress = {
              () => this.AddDevice()
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AddDeviceScreen)
