import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'

import { enumStatus } from '../../utils/enums'

import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars


// import CalendarPicker from 'react-native-calendar-picker';

class HistoryScreen extends Component {
    
    constructor(props) {
        super(props);

        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          sortedData:{},
          
        };

        
    }
    componentDidMount() {
      
      // this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(this.state.selectedStartDate.format("YYYY-MM-DD")).endAt(this.state.selectedStartDate.format("YYYY-MM-DD")+"\uf8ff");
      this.ref = this.props.currentDevice.referenceKey.collection('history').orderBy("date_time","desc");

    
      this.unsubscribe = this.ref.onSnapshot(snapshot => this.onCollectionUpdate(snapshot));
    }


    onCollectionUpdate = (snapshot) => {

      this.setState({
        sortedData: null,
        isLoading: true,
      });

      if(snapshot==null||snapshot.size == 0)
      return;

      
      let sortedData = {}

      sortedData["time_stamp"] = []
      sortedData["goat"] = []
      sortedData["status"] = []
      snapshot.forEach(doc => {

        let data = doc.data()
        
        
        sortedData["time_stamp"].push(data.date_time)
        sortedData["goat"].push(data.goat)
        sortedData["status"].push(data.status)
      });

      // console.log(sortedData)

      this.setState({
        sortedData,
        isLoading: false,
      });

    }



    
    render(){
        
      return(
      <View>
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>History</Text>
          </View>
          {
          this.state.isLoading?<View><ActivityIndicator size="large" color="#000000"/>
              <Text style={styles.item}>Loading...</Text>
            
              <Text style={styles.item}>If it's taking too long, this device has no data on this date</Text>
            </View>:
          <View style={styles.subContainer}>
              
              <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                <View style={styles.itemTime}>
                  <Text style={styles.itemText}>Date and Time</Text>
                </View>
                <View style={styles.itemTable}>
                  <Text style={styles.itemText}>Goat</Text>
                </View>
                <View style={styles.itemTable}>
                  <Text style={styles.itemText}>Status</Text>
                </View>
              </View>  
              {
                
                this.state.sortedData.time_stamp.map((item, i) => (
                

                    <View key={i}  style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                        <View style={styles.itemTime}>
                          <Text style={styles.itemText}>{this.state.sortedData.time_stamp!=null&&this.state.sortedData.time_stamp[i]?"\n" + this.state.sortedData.time_stamp[i].toDate().toLocaleString():""}</Text>
                        </View>
                        <View style={styles.itemTable}>
                          <Text style={styles.itemText}>{this.state.sortedData.goat!=null&&this.state.sortedData.goat[i]?"\n" + this.state.sortedData.goat[i]:"N/A"}</Text>
                        </View>
                        <View style={styles.itemTable}>
                          <Text style={styles.itemText}>{this.state.sortedData.status!=null&&this.state.sortedData.status[i]!=null?"\n" + enumStatus[this.state.sortedData.status[i]]:"N/A"}</Text>
                        </View>
                    </View>  
                  
                ))
              }
            </View>
            }
          
          </ScrollView>
        </View>
      )
    }
}


const mapStateToProps = state => ({
  currentDevice: state.currentDevice
})

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  HistoryScreen)
