import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineChart, YAxis, XAxis, Path, Grid } from 'react-native-svg-charts'
import { Dimensions } from 'react-native'
const screenWidth = Dimensions.get('window').width

class Graph extends Component {

  constructor(props) {
    super(props);

  
    this.state = {
        Y_labels:[],
        X_labels:[],
      Data:[]
    };


   
  } 

  render() {
    return (
      <View >
        <View style={{ marginTop: 50, height: 200, flexDirection: 'row' }}>
  
          <YAxis
            data={this.props.Y_labels}
            contentInset={{ left: 10, right: 10 }}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={10}
            formatLabel={(value) => `${value}`}
          />
  
          <LineChart
            style={{ flex: 1, marginLeft: 16 }}
            data={this.props.Data}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={{ left: 10, right: 10 }}
          >
  
  
            <Grid />
  
          </LineChart>
          <XAxis
            style={{ marginHorizontal: -10 }}
            data={[0]}
            formatLabel={(value, index) => index}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
  
  
  
      </View >
  
    );
  }
}

export default Graph;