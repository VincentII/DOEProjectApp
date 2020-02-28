import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars


class GraphScreen extends Component {
    
    constructor(props) {
        super(props);

        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          dataQuery:[],
          sortedData:{}
        };

        
        this.ref = firebase.database().ref().child("raw_data").child(this.props.currentDevice.id).orderByChild("unix_time").limitToLast(20);
    }
    componentDidMount() {
      
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
      console.log(querySnapshot)
      const raw = querySnapshot.val();

      if(raw==null)
      return;
      console.log("ADDED")

      const dataQuery = this.state.dataQuery

      //dataQuery.push(raw.val());

      const sortedData = this.state.sortedData

      if(sortedData["time_stamp"]==null){
        sortedData["time_stamp"] = []
      }

      var chunkKeys = Object.keys(raw.data_chunks)
      chunkKeys.forEach(function(key){

        if(sortedData[key]==null){
          sortedData[key] = []
          sortedData[key].push(raw.data_chunks[key])
        }
        else{
          sortedData[key].push(raw.data_chunks[key])
        }
      })


      sortedData["time_stamp"].push(raw.date_time)
      this.setState({
        sortedData,
        isLoading: false,
      });

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
                  <Text style={styles.title}>Data</Text>
                </View>
                
                <ScrollView style={styles.subContainer}>
                  <Text style={styles.header}>
                
                  </Text>
                  {
                    
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
                  }
                </ScrollView>
              </View>
            )
          }
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
