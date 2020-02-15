import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'


import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../js/actions'

class DeviceScreen extends Component {
    
    constructor(props) {
        super(props);


        this.state = {
          isLoading: false,
          devices:[],
        };
    }
    componentDidMount() {

    }

    OnShowGraphs = (event) => {
 
      this.props.navigation.navigate('Graph',{});
    }

    render(){
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.currentDevice.id}</Text>
            
            <Text style={styles.subTitle}>{"Connected Goat: "+this.props.currentDevice.goat}</Text>
          </View>
          <Button 
            buttonStyle={styles.clearButton} 
            titleStyle={styles.clearButtonText} 
            title={"Show Graphs"}
            onPress = {
              () => this.OnShowGraphs()
            }
            >
          </Button>
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
  DeviceScreen)
