import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars


import DateTimePickerModal from "react-native-modal-datetime-picker";
// import CalendarPicker from 'react-native-calendar-picker';

import moment from 'moment';


class TableScreen extends Component {
    
    constructor(props) {
        super(props);

        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          sortedData:{},
          selectedStartDate: moment().startOf('day'),
          selectedEndDate: moment().endOf('day'),
          isDatePickerVisible:false,
          isTimePickerVisible:false,
          dateTimeType:"start",
          
        };

        
    }
    componentDidMount() {
      
      // this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(this.state.selectedStartDate.format("YYYY-MM-DD")).endAt(this.state.selectedStartDate.format("YYYY-MM-DD")+"\uf8ff");
      this.ref = firestore.collection('raw_data').where('device_id', '==', this.props.currentDevice.id).where('date_time', '<=',this.state.selectedEndDate.toDate()).orderBy("date_time","desc").limit(100);

    
      this.unsubscribe = this.ref.onSnapshot(snapshot => this.onCollectionUpdate(snapshot));
    }

    // onCollectionOnce = (querySnapshot) => {
    //   const raw = querySnapshot;

    //   if(raw==null)
    //   return;
      
    //   console.log("Initial")

    //   const dataQuery = []

    //   const sortedData = {}
    //   raw.forEach(function(d) {
    //     var childData = d.val();

    //     var chunkKeys = Object.keys(childData.data_chunks)
    //     chunkKeys.forEach(function(key){

    //       if(sortedData[key]==null){
    //         sortedData[key] = []
    //         sortedData[key].push(childData.data_chunks[key])
    //       }
    //       else{
    //         sortedData[key].push(childData.data_chunks[key])
    //       }
    //     })


    //   });

    //   console.log(sortedData)

    //   this.setState({
    //     isLoading: false,
    //   });

    // }

    onCollectionUpdate = (snapshot) => {

      console.log("UPDATE")
      // snapshot.forEach(doc => {
      //   console.log(doc.data())
      // });
      // // const raw = querySnapshot.val();

      this.setState({
        sortedData: null,
        isLoading: true,
      });

      if(snapshot==null||snapshot.size == 0)
      return;

      
      let sortedData = {}

      sortedData["time_stamp"] = []
      snapshot.forEach(doc => {

        let data = doc.data()




        var chunkKeys = Object.keys(data.data_chunks)
        chunkKeys.forEach(function(key){

          if(sortedData[key]==null){
            sortedData[key] = []
          }

          // sortedData[key].push({date:data.date_time,score:parseFloat(data.data_chunks[key])})
          sortedData[key].push(parseFloat(data.data_chunks[key]))

          
        })
        sortedData["time_stamp"].push(data.date_time)
        
      });

      //console.log(sortedData)

      this.setState({
        sortedData,
        isLoading: false,
      });


      // const sortedData = this.state.sortedData

      // if(sortedData["time_stamp"]==null){
      //   sortedData["time_stamp"] = []
      // }

      // var chunkKeys = Object.keys(raw.data_chunks)
      // chunkKeys.forEach(function(key){

      //   if(sortedData[key]==null){
      //     sortedData[key] = []
      //     sortedData[key].push(parseFloat(raw.data_chunks[key]))
      //   }
      //   else{
      //     sortedData[key].push(parseFloat(raw.data_chunks[key]))
      //   }

        
      // //console.log(sortedData)
      // })


      // sortedData["time_stamp"].push(raw.date_time)
      // this.setState({
      //   sortedData,
      //   isLoading: false,
      // });

    }



    showDatePicker = (dateTimeType) => {
      this.setState({
        isDatePickerVisible:true,dateTimeType
      });
    };
  
    hideDatePicker = () => {
      this.setState({
        isDatePickerVisible:false,
      });
    };

    showTimePicker = (dateTimeType) => {
      this.setState({
        isTimePickerVisible:true,dateTimeType
      });
    };
  
    hideTimePicker = () => {
      this.setState({
        isTimePickerVisible:false,
      });
    };
    
    onDateChange = (date) =>{
   
      var startDate = this.state.selectedStartDate;
      var endDate = this.state.selectedEndDate;

      if(this.state.dateTimeType == "start"){
        this.setState({
          selectedStartDate: date,
        });

        startDate = date
      }
      else {

        this.setState({
          selectedEndDate: date,
        });

        endDate = date
      }

      this.ref = firestore.collection('raw_data').where('device_id', '==', this.props.currentDevice.id).where('date_time', '<=',endDate.toDate()).orderBy("date_time","desc").limit(100);
      this.unsubscribe = this.ref.onSnapshot(snapshot => this.onCollectionUpdate(snapshot));

      
    }

  
    handleTimeConfirm = (time) => {
      // console.warn("A time has been picked: ", time);


      var outDate = this.state.selectedEndDate
  

      this.hideTimePicker();

      this.onDateChange(moment(outDate.clone().format('L') + " " + moment(time).format('HH:mm')));
    };
  
    handleDateConfirm = (date) => {

      var outTime = this.state.selectedEndDate
      
      this.hideDatePicker();

      this.onDateChange(moment(moment(date).format('L') + " " + outTime.format('HH:mm')));
    };
    
    render(){
      const { selectedStartDate,selectedEndDate } = this.state;
      const startDate = selectedStartDate ? selectedStartDate.format("LL") : '';
      const startTime = selectedStartDate ? selectedStartDate.format("LTS") : '';

      const endDate = selectedEndDate ? selectedEndDate.format("LL") : '';
      const endTime = selectedEndDate ? selectedEndDate.format("LTS") : '';
      const maxDate = this.state.dateType=="end"?new Date():endDate; // Today



        
      return(
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Data</Text>
          </View>

          <Text style={{textAlign:"center"}}>DATE FILTER</Text>
          <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Button buttonStyle={styles.clearButton} 
                    titleStyle={styles.clearButtonText}
                    title={endDate}
                    onPress={() => this.showDatePicker('end')} />
            <Button buttonStyle={styles.clearButton} 
                    titleStyle={styles.clearButtonText}
                    title={endTime} 
                    onPress={() => this.showTimePicker('end')} />
          </View>

          <DateTimePickerModal
              isVisible={this.state.isDatePickerVisible}
              mode="date"
              date={this.state.dateTimeType == "start"?selectedStartDate.toDate():selectedEndDate.toDate()}
              onConfirm={this.handleDateConfirm}
              onCancel={this.hideDatePicker}
            />
            <DateTimePickerModal
              isVisible={this.state.isTimePickerVisible}
              mode="time"
              date={this.state.dateTimeType == "start"?selectedStartDate.toDate():selectedEndDate.toDate()}
              onConfirm={this.handleTimeConfirm}
              onCancel={this.hideTimePicker}
            />

          {this.state.isLoading?<View><ActivityIndicator size="large" color="#000000"/>
              <Text style={styles.item}>Loading...</Text>
            
              <Text style={styles.item}>If it's taking too long, this device has no data on this date</Text>
            </View>:
            <View style={styles.subContainer}>
              
              <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                <View style={styles.itemTime}>
                  <Text style={styles.itemText}>Date and Time</Text>
                </View>
                <View style={styles.itemTable}>
                  <Text style={styles.itemText}>Cond</Text>
                </View>
                <View style={styles.itemTable}>
                  <Text style={styles.itemText}>pH</Text>
                </View>
                <View style={styles.itemTable}>
                  <Text style={styles.itemText}>Temp</Text>
                </View>
                <View style={styles.itemTable}>
                  <Text style={styles.itemText}>Acc</Text>
                </View>
              </View>  
              {
                
                this.state.sortedData.time_stamp.map((item, i) => (
                

                    <View key={i}  style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                        <View style={styles.itemTime}>
                          <Text style={styles.itemText}>{this.state.sortedData.time_stamp!=null&&this.state.sortedData.time_stamp[i]?"\n" + this.state.sortedData.time_stamp[i].toDate().toLocaleString():""}</Text>
                        </View>
                        <View style={styles.itemTable}>
                          <Text style={styles.itemText}>{this.state.sortedData.cond!=null&&this.state.sortedData.cond[i]?"\n" + this.state.sortedData.cond[i]:"N/A"}</Text>
                        </View>
                        <View style={styles.itemTable}>
                          <Text style={styles.itemText}>{this.state.sortedData.ph!=null&&this.state.sortedData.ph[i]?"\n" + this.state.sortedData.ph[i]:"N/A"}</Text>
                        </View>
                        <View style={styles.itemTable}>
                          <Text style={styles.itemText}>{this.state.sortedData.temp!=null&&this.state.sortedData.temp[i]?"\n" + this.state.sortedData.temp[i]:"N/A"}</Text>
                        </View>
                        <View style={styles.itemTable}>
                          <Text style={styles.itemText}>{this.state.sortedData.x!=null&&this.state.sortedData.x[i]?"\nx:" + this.state.sortedData.x[i]+"\ny:"+this.state.sortedData.y[i]+"\nz:"+this.state.sortedData.z[i]:"N/A"}</Text>
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
  TableScreen)
