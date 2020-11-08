import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert, StatusBar} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { enumStatus } from '../../utils/enums'

import firebase from '../../../config/firebase';
import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars

class DeviceScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        
      return {
        title: 'Devices',
        headerRight: (
          <Button
            buttonStyle={{ padding: 10, backgroundColor: 'transparent' }}
            titleStyle={styles.clearButtonText} 
            title={"Remove"}
            onPress={navigation.getParam('OnRemoveDevicePress')}
          />
        ),
      
      };
    };

    constructor(props) {
        super(props);


        this.state = {
          isLoading: false,
          devices:[],
          battery:0
        };
    }
    async componentDidMount() {

      this.props.navigation.setParams({ OnRemoveDevicePress: this.OnRemoveDevicePress });

      this.ref = firestore.collection('raw_data').where('device_id', '==', this.props.currentDevice.id).orderBy("date_time").limitToLast(1);

      const snapshot = await this.ref.get();

      snapshot.forEach(doc => {
        this.setState({battery:parseInt(doc.data().data_chunks['batt'])});
      });
    }

    OnShowGraphs = (event) => {
 
      this.props.navigation.navigate('Graph',{});
    }

    OnShowTables = (event) => {
 
      this.props.navigation.navigate('Table',{});
    }

    OnShowHistory = (event) => {
 
      this.props.navigation.navigate('History',{});
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
              <Text style={styles.subTitle2}>{"Battery: "+this.state.battery+"%"}</Text>
              <Text style={styles.subTitle2}>{enumStatus[this.props.currentDevice.status]}</Text>
              <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Show Graphs"}
              onPress = {
                () => this.OnShowGraphs()
              }
              >
            </Button>
            <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Show Tables"}
              onPress = {
                () => this.OnShowTables()
              }
              >
            </Button>
            <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Show History"}
              onPress = {
                () => this.OnShowHistory()
              }
              >
            </Button>
          </View>
            <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Edit Device"}
              onPress = {
                () => this.props.navigation.navigate("DeviceEdit")
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
