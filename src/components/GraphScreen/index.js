import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

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
          selectedStartDate: moment(),
          dateModal:false
        };

        
           }
    componentDidMount() {
      
      this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(this.state.selectedStartDate.format("YYYY-MM-DD")).endAt(this.state.selectedStartDate.format("YYYY-MM-DD")+"\uf8ff");
      this.unsubscribe = this.ref.on('child_added',this.onCollectionAdditon)
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

    onCollectionAdditon = (querySnapshot) => {
      const raw = querySnapshot.val();

      if(raw==null)
      return;



      const sortedData = this.state.sortedData

      if(sortedData["time_stamp"]==null){
        sortedData["time_stamp"] = []
      }

      var chunkKeys = Object.keys(raw.data_chunks)
      chunkKeys.forEach(function(key){

        if(sortedData[key]==null){
          sortedData[key] = []
          sortedData[key].push(parseFloat(raw.data_chunks[key]))
        }
        else{
          sortedData[key].push(parseFloat(raw.data_chunks[key]))
        }

        
      //console.log(sortedData)
      })


      sortedData["time_stamp"].push(raw.date_time)
      this.setState({
        sortedData,
        isLoading: false,
      });

    }

    onOpenDateModal = () =>{
      this.setState({
        dateModal:true
      })
    }
    
    onDateChange = (date) =>{
   
      this.setState({
        isLoading: true,
        selectedStartDate: date,
        dateModal:false
      });
      console.log(this.state.sortedData)
      this.state.sortedData = {}

      this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("date_time").startAt(date.format("YYYY-MM-DD")).endAt(date.format("YYYY-MM-DD")+"\uf8ff");
      this.unsubscribe = this.ref.on('child_added',this.onCollectionAdditon)
    }
    
    render(){
      const { selectedStartDate } = this.state;
      const startDate = selectedStartDate ? selectedStartDate.format("LL") : '';
      const maxDate = new Date(); // Today



        
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Data</Text>
          </View>

          {!this.state.dateModal?
          <Button 
            buttonStyle={styles.clearButton} 
            titleStyle={styles.clearButtonText} 
            title={startDate}
            onPress = {this.onOpenDateModal}>
          </Button>
          :
          <CalendarPicker
            onDateChange={this.onDateChange}
            maxDate={maxDate}
          />}

          {this.state.isLoading?<View><ActivityIndicator size="large" color="#000000"/>
              <Text style={styles.item}>Loading...</Text>
            
              <Text style={styles.item}>If it's taking too long, this device has no data on this date</Text>
            </View>:
            <ScrollView style={styles.subContainer}>
              <Text style={styles.header}>
                Cond
              </Text>
                              
              {this.state.sortedData.temp!=null?<Graph Data={this.state.sortedData.cond} Y_labels={this.state.sortedData.cond}/>:<></>}
              
              <Text style={styles.header}>
                Temp
              </Text>
              {this.state.sortedData.temp!=null?<Graph Data={this.state.sortedData.temp} Y_labels={this.state.sortedData.temp}/>:<></>}
              <Text style={styles.header}>
                pH
              </Text>
              {this.state.sortedData.temp!=null?<Graph Data={this.state.sortedData.pH} Y_labels={this.state.sortedData.pH}/>:<></>}
              <Text style={styles.header}>
                Battery
              </Text>
              {this.state.sortedData.temp!=null?<Graph Data={this.state.sortedData.Battery} Y_labels={this.state.sortedData.Battery}/>:<></>}
    
              
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
            </ScrollView>
          }
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
