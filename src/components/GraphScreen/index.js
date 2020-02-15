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

        this.ref = firebase.database().ref().child("raw_data").orderByChild("unix_time").limitToLast(10);
        this.unsubscribe = null;
        this.state = {
          isLoading: true,
          dataQuery:[],
        };
    }
    componentDidMount() {
      this.unsubscribe = this.ref.on('child_added',this.onCollectionUpdate);
    }
    onCollectionUpdate = (querySnapshot) => {
      const raw = querySnapshot;

      if(raw==null)
      return;
      
      console.log(raw.val())

      const dataQuery = this.state.dataQuery
      dataQuery.push(raw.val());
      this.setState({
        dataQuery,
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
                  {/* <Text>{this.state.devices}</Text> */}
                  {
                    
                    this.state.dataQuery.map((item, i) => (
                      <Text
                        key={i} 
                        >
                        {item.date_time}
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
