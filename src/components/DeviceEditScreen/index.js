import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert, StatusBar} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'
import { enumStatus } from '../../utils/enums'

import firebase from '../../../config/firebase';
import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'

class DeviceEditScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        
      return {
        title: 'Edit Device',
        
      
      };
    };

    constructor(props) {
        super(props);


        this.state = {
          isLoading: false,
          devices:[],
          battery:0,
          connectGoat:""
        };
    }
    componentDidMount() {
    
    }

    OnClickCalibrate = async() =>{

      var data = {
        goat:this.props.currentDevice.goat,
        status:2
      }

      var doc = this.props.currentDevice.referenceKey;

      await doc.update({"current_goat":data.goat,"status":data.status}).then(async() =>{
        await doc.collection("history").add({
          status:data.status,
          goat:data.goat,
          date_time:new Date()
        }).then(() => {
          this.OnUpdatedDev();
        });
      });


      
    }

    OnClickFinishCalibrate = async() =>{

      var data = {
        goat:this.props.currentDevice.goat,
        status:1
      }

      var doc = this.props.currentDevice.referenceKey;

      await doc.update({"current_goat":data.goat,"status":data.status}).then(async() =>{
        await doc.collection("history").add({
          status:data.status,
          goat:data.goat,
          date_time:new Date()
        }).then(() => {
          this.OnUpdatedDev();
        });
      });


      
    }

    OnClickDisconnect = async() =>{

      var data = {
        goat:"[No Goat]",
        status:0
      }

      var doc = this.props.currentDevice.referenceKey;

      await doc.update({"current_goat":data.goat,"status":data.status}).then(async() =>{
        await doc.collection("history").add({
          status:data.status,
          goat:data.goat,
          date_time:new Date()
        }).then(() => {
          this.OnUpdatedDev();
        });
      });

      
    }
    
    OnClickConnect = async() =>{

      if(this.state.connectGoat==""||this.state.connectGoat==null)
        return;

      var data = {
        goat:this.state.connectGoat,
        status:1
      }

      var doc = this.props.currentDevice.referenceKey;

      await doc.update({"current_goat":data.goat,"status":data.status}).then(async() =>{
        await doc.collection("history").add({
          status:data.status,
          goat:data.goat,
          date_time:new Date()
        }).then(() => {
          this.OnUpdatedDev();
        });
      });

      
    }

    OnUpdatedDev = async() => {

      console.log("UPDATED GOAT:", this.props.currentDevice.id)
      
      var doc = this.props.currentDevice.referenceKey;

      var newDevice =  await doc.get();
      
      if (newDevice!=null) {
        
        var dev = {id:newDevice.id,goat:newDevice.data().current_goat,referenceKey:this.props.currentDevice.referenceKey,status:newDevice.data().status}
        this.props.setCurrentDevice(dev);
        
        this.props.navigation.goBack()
      } else {
        console.log("Goat does not exist");
        // this.props.navigation.navigate('Device',{})
      }

      
      
    }

    render(){
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.title}>{"EDITING: "+this.props.currentDevice.id}</Text>
            <Text style={styles.subTitle2}>{enumStatus[this.props.currentDevice.status]}</Text>
              

              {
                this.props.currentDevice.status!=0
                ?
                <Text style={styles.subTitle}>{"Connected Goat: "+this.props.currentDevice.goat}</Text>
                :
                <View>
                  <TextInput underlineColorAndroid={Colors.text} placeholder="Goat Name"  style={styles.inputStyle} onChangeText={(text) => this.setState({connectGoat:text})} value={this.state.connectGoat}/>
                  <Button 
                    buttonStyle={styles.clearButton} 
                    titleStyle={styles.clearButtonText} 
                    title={"Connect Goat"}
                    onPress = {
                      () => this.OnClickConnect()
                    }
                    >
                  </Button>
                </View>
              }
          </View>
            
            {
              this.props.currentDevice.status==1?
              <Button 
                buttonStyle={styles.clearButton} 
                titleStyle={styles.clearButtonText} 
                title={"Disconnect Goat"}
                onPress = {
                  () => this.OnClickDisconnect()
                }
                >
              </Button>:
              <></>
            }
            {
              this.props.currentDevice.status==1?
            <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Calibrate"}
              onPress = {
                () => this.OnClickCalibrate()
              }
              >
            </Button>:<></>
            }
            {
              this.props.currentDevice.status==2?
            <Button 
              buttonStyle={styles.clearButton} 
              titleStyle={styles.clearButtonText} 
              title={"Finish Calibration"}
              onPress = {
                () => this.OnClickFinishCalibrate()
              }
              >
            </Button>:<></>
            }
          
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
    setCurrentDevice: (device) => dispatch(setCurrentDevice(device))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DeviceEditScreen)
