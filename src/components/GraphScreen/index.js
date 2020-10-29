import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars

import Graph from './Graph'

import DateTimePickerModal from "react-native-modal-datetime-picker";
// import CalendarPicker from 'react-native-calendar-picker';

import moment from 'moment';


class GraphScreen extends Component {
    
    constructor(props) {
        super(props);

        this.unsubscribe = null;
        this._MaxLimit = 100;
        this.state = {
          isLoading: true,
          sortedData:{},
          selectedStartDate: moment().startOf('day'),
          selectedEndDate: moment().endOf('day'),
          isDateUpdating:false,
          isDatePickerVisible:false,
          isTimePickerVisible:false,
          dateTimeType:"start",
          limit:this._MaxLimit,
          
        };

        
    }
    componentDidMount() {
      
      // this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(this.state.selectedStartDate.format("YYYY-MM-DD")).endAt(this.state.selectedStartDate.format("YYYY-MM-DD")+"\uf8ff");
      this.ref = firestore.collection('raw_data').where('device_id', '==', this.props.currentDevice.id).where('date_time', '<=',this.state.selectedEndDate.toDate()).orderBy("date_time").limitToLast(30);

      
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
      let count = 0;
      sortedData["time_stamp"] = []
      let limit = this.state.limit;
      
 
      limit = (limit<1||limit>this._MaxLimit||limit==null)?this._MaxLimit:limit;

      let offset = snapshot.size-Math.ceil((snapshot.size*1.0)/limit)*(limit-1)-1;
      console.log("Size: " + snapshot.size);
      snapshot.forEach(doc => {
        if((count-offset)>=0)
          if((count-offset)%Math.ceil((snapshot.size*1.0)/limit)==0){

            // console.log(count);
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
          }
        count++;
        
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

      this.ref = firestore.collection('raw_data').where('date_time', '<=',endDate.toDate()).orderBy("date_time").limitToLast(30);
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

          {/* {!this.state.dateModal?
          <View>
            <View>
              <Button 
                buttonStyle={styles.clearButton} 
                titleStyle={styles.clearButtonText} 
                title={startDate}
                onPress = {() => this.onOpenDateModal('start')}>
              </Button>
            </View>
              <Text style={{textAlign:"center"}}>to</Text>
            <View>
              <Button 
                buttonStyle={styles.clearButton} 
                titleStyle={styles.clearButtonText} 
                title={endDate}
                onPress = {() => this.onOpenDateModal('end')}>
              </Button>
            </View>
          </View>
          :
          <CalendarPicker
            onDateChange={this.onDateChange}
            maxDate={maxDate}
          />} */}
          {/* <Text style={{textAlign:"center"}}>FROM</Text>
          <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Button buttonStyle={styles.clearButton} 
                    titleStyle={styles.clearButtonText}
                    title={startDate}
                    onPress={() => this.showDatePicker('start')} />
            <Button buttonStyle={styles.clearButton} 
                    titleStyle={styles.clearButtonText}
                    title={startTime} 
                    onPress={() => this.showTimePicker('start')} />
          </View> */}
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
          <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Text style={{textAlign:"center"}}>Summarize to:</Text>
            <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({limit:text.replace(/[^0-9]/g, ''),isDateUpdating:true})}  value={this.state.limit+""}/>
          </View>
          <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Button onPress={this.onSubmitChanges} buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText}  title={"Submit"}></Button>
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

          {this.state.isLoading || this.state.isTimePickerVisible || this.state.isDatePickerVisible||this.state.isDateUpdating?
            <View><ActivityIndicator size="large" color="#000000"/>

              <Text style={styles.item}>Loading...</Text>
              {this.state.isDateUpdating?
              <Text style={styles.item}>Click the submit button!</Text>
              :
              <Text style={styles.item}>If it's taking too long, this device has no data on this date</Text>
              }
              
            </View>
            :
            <View style={styles.subContainer}>
              {/* <Text style={styles.header}>
                Battery
              </Text>
              {this.state.sortedData.batt!=null?<Graph Data={this.state.sortedData.batt} Y_labels={this.state.sortedData.batt} X_labels={this.state.sortedData.time_stamp}/>:<></>} */}
              <Text style={styles.header}>
                Cond
              </Text>            
              {this.state.sortedData.cond!=null?<Graph Data={this.state.sortedData.cond} Y_labels={this.state.sortedData.cond} X_labels={this.state.sortedData.time_stamp}/>:<></>}
              
              <Text style={styles.header}>
                Temp
              </Text>
              {this.state.sortedData.temp!=null?<Graph Data={this.state.sortedData.temp} Y_labels={this.state.sortedData.temp} X_labels={this.state.sortedData.time_stamp}/>:<></>}
              
              <Text style={styles.header}>
                pH
              </Text>
              {this.state.sortedData.ph!=null?<Graph Data={this.state.sortedData.ph} Y_labels={this.state.sortedData.ph} X_labels={this.state.sortedData.time_stamp}/>:<></>}
              <Text style={styles.header}>
                x
              </Text>
              {this.state.sortedData.x!=null?<Graph Data={this.state.sortedData.x} Y_labels={this.state.sortedData.x} X_labels={this.state.sortedData.time_stamp}/>:<></>}
              
              <Text style={styles.header}>
                y
              </Text>
              {this.state.sortedData.y!=null?<Graph Data={this.state.sortedData.y} Y_labels={this.state.sortedData.y} X_labels={this.state.sortedData.time_stamp}/>:<></>}
              
              <Text style={styles.header}>
                z
              </Text>
              {this.state.sortedData.z!=null?<Graph Data={this.state.sortedData.z} Y_labels={this.state.sortedData.z} X_labels={this.state.sortedData.time_stamp}/>:<></>}
    
              
              <Text style={styles.header}>
                y
              </Text>
              {this.state.sortedData.y!=null?<Graph Data={this.state.sortedData.y} Y_labels={this.state.sortedData.y} X_labels={this.state.sortedData.time_stamp}/>:<></>}
              
              <Text style={styles.header}>
                z
              </Text>
              {this.state.sortedData.z!=null?<Graph Data={this.state.sortedData.z} Y_labels={this.state.sortedData.z} X_labels={this.state.sortedData.time_stamp}/>:<></>}
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
  GraphScreen)
