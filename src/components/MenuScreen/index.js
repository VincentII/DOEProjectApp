import React, { Component} from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert,BackHandler} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'


import {firestore} from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'

class MenuScreen extends Component {
    


    constructor(props) {
        super(props);

        // this.ref = firebase.database().ref().child("users").child(this.props.user.id).child("devices");
        this.doc = firestore.collection('users').doc(this.props.user.id);
        this.unsubscribe = null;
        this.state = {
          isLoading: false,
          devices:[],
        };
    }

    
    static navigationOptions = ({ navigation }) => {
      
      return {
        title: 'Devices Menu',
        headerRight: (
          <Button
            buttonStyle={{ padding: 10, backgroundColor: 'transparent' }}
            titleStyle={styles.clearButtonText} 
            title={"Profile"}
            onPress={()=>navigation.navigate('Profile',{})}
          />
        ),
        headerLeft: null
      
      };
    };

    componentDidMount() {
      this.unsubscribe = this.doc.onSnapshot(docSnapshot => this.onCollectionUpdate(docSnapshot));
      
    }

    onCollectionUpdate = (querySnapshot) => {
      const raw = querySnapshot.data().devices;

      if(raw==null)
        return;

      this.setState({
        isLoading: true,
        }); 
      

      const devices = []

      this.setState({devices})
      
      const out = this;
      
      raw.forEach(function(device){
        
        device.onSnapshot(deviceSnap =>{
        
            if(deviceSnap.data()!=null){
              var d = {referenceKey:device,id:deviceSnap.id,currentGoat:deviceSnap.data().current_goat}
    
              devices.push(d) 
              
              out.setState({
                devices
              });
            }
          })
    
      });

      // raw.forEach(function(child){
      //   let deviceRef = firebase.database().ref().child("devices/"+child.val());
      //   deviceRef.once('value').then(deviceSnap =>{
        
      //   if(deviceSnap.val()!=null){
      //     var d = {referenceKey:child.key,id:deviceSnap.key,currentGoat:deviceSnap.val().current_goat}

      //     devices.push(d) 
          
      //     out.setState({
      //       devices
      //     });
      //   }
      // })

      // })
      

      this.setState({
        isLoading: false,
      });
    }
    
    

    OnPressDeviceButton = (id,goat,referenceKey) => {
 
      var dev = {id,goat,referenceKey}
      this.props.setCurrentDevice(dev);
      this.props.navigation.navigate('Device',{});
    }

    OnPressAddDeviceButton = () =>{
      this.props.navigation.navigate('AddDevice',{}) 
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
                        title={"[ID: "+item.id + "]\nGoat: " +item.currentGoat}
                        onPress = {
                          () => this.OnPressDeviceButton(item.id,item.currentGoat,item.referenceKey)
                        }
                        >
                      </Button>
                    ))
                  }
                  
                </ScrollView>
                <Button 
                        buttonStyle={styles.clearButton} 
                        titleStyle={styles.clearButtonText} 
                       
                        title={"+ Add Devce"}
                        onPress = {
                          () => this.OnPressAddDeviceButton()
                        }
                        >
                      </Button>
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
