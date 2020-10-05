import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

import { firestore } from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars

import Graph from './Graph'

import CalendarPicker from 'react-native-calendar-picker';

import moment from 'moment';


class GraphScreen extends Component {
    
    constructor(props) {
        super(props);

        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          sortedData:{},
          selectedStartDate: moment().startOf('day'),
          selectedEndDate: moment().endOf('day'),
          dateModal:false,
          dateType:"start",
        };

        
           }
    componentDidMount() {
      
      // this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(this.state.selectedStartDate.format("YYYY-MM-DD")).endAt(this.state.selectedStartDate.format("YYYY-MM-DD")+"\uf8ff");
      this.ref = firestore.collection('raw_data').where('device_id', '==', this.props.currentDevice.id).where('date_time', '>=', this.state.selectedStartDate.toDate()).where('date_time', '<=',this.state.selectedEndDate.toDate());

    
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

      console.log(sortedData)

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

    onOpenDateModal = (dateType) =>{
      this.setState({
        dateType,
        dateModal:true
      })
    }
    
    onDateChange = (date) =>{
   
      var startDate = this.state.selectedStartDate;
      var endDate = this.state.selectedEndDate;

      if(this.state.dateType == "start"){
        this.setState({
          selectedStartDate: date.startOf('day'),
          dateModal:false
        });

        startDate = date.startOf('day')
      }
      else {
        this.setState({
          isLoading: true,
          selectedEndDate: date.clone().endOf('day'),
          dateModal:false
        });

        endDate = date.clone().endOf('day')


        if(this.state.selectedStartDate.isAfter(date)){
            this.setState({
              selectedStartDate: date.startOf('day'),
            });

          startDate =  date.startOf('day')
        }
      }

      this.ref = firestore.collection('raw_data').where('device_id', '==', this.props.currentDevice.id).where('date_time', '>=', startDate.toDate()).where('date_time', '<=',endDate.toDate());
      this.unsubscribe = this.ref.onSnapshot(snapshot => this.onCollectionUpdate(snapshot));
      // this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(date.format("YYYY-MM-DD")).endAt(date.format("YYYY-MM-DD")+"\uf8ff");
      // this.unsubscribe = this.ref.on('child_added',this.onCollectionAdditon)
    }
    
    render(){
      const { selectedStartDate,selectedEndDate } = this.state;
      const startDate = selectedStartDate ? selectedStartDate.format("LLL") : '';
      const endDate = selectedEndDate ? selectedEndDate.format("LLL") : '';
      const maxDate = this.state.dateType=="end"?new Date():endDate; // Today



        
      return(
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Data</Text>
          </View>

          {!this.state.dateModal?
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
          :
          <CalendarPicker
            onDateChange={this.onDateChange}
            maxDate={maxDate}
          />}

          {this.state.isLoading?<View><ActivityIndicator size="large" color="#000000"/>
              <Text style={styles.item}>Loading...</Text>
            
              <Text style={styles.item}>If it's taking too long, this device has no data on this date</Text>
            </View>:
            <View style={styles.subContainer}>
              <Text style={styles.header}>
                Battery
              </Text>
              {this.state.sortedData.batt!=null?<Graph Data={this.state.sortedData.batt} Y_labels={this.state.sortedData.batt} X_labels={this.state.sortedData.time_stamp}/>:<></>}
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
              
    
              
              {/* {
                
                this.state.sortedData.time_stamp.map((item, i) => (
                  <Text
                    key={i} 
                    style={styles.item}
                    >
                    [{item}] 
                    {this.state.sortedData.cond!=null?"\nCond:" + this.state.sortedData.cond[i]:""}
                    {this.state.sortedData.pH!=null?"\npH:" + this.state.sortedData.pH[i]:""}
                    {this.state.sortedData.temp!=null?"\ntemp:" + this.state.sortedData.temp[i]:""}
                    {'\n'}
                  </Text>

                  
                ))
              } */}
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
