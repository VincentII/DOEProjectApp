import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart, YAxis, XAxis, Path, Grid } from 'react-native-svg-charts'
import { Dimensions } from 'react-native'
const screenWidth = Dimensions.get('window').width



import { Circle, G, Line, Rect, Text } from 'react-native-svg'
// import Tooltip from './Tooltip';


// For examples see
// https://github.com/JesperLekland/react-native-svg-charts-examples

class Graph extends Component {

  constructor(props) {
    super(props);

  
    this.state = {
      tooltipX: null,
      tooltipY: null,
      tooltipIndex: null,
    };
    

   
  }

  

  render() {

    const data = this.props.Data
    const { tooltipX, tooltipY, tooltipIndex } = this.state;
    const dates = this.props.X_labels
    
    
    const ChartPoints = ({ x, y, color }) =>
    data.map((item, index) => (
      <G>
        <Circle
          key={index}
          cx={x(index)}
          cy={y(item)}
          r={4}
          stroke={null}
          fill="blue"
        
        />
        <Rect
          key={index + "_Button"}
          width={24}
          height={24}
          x={x(index)-12}
          y={y(item)-12}
          fill="transparent"
          onPress={() =>
            this.setState({
              tooltipX: dates[index].toDate().toLocaleString(),
              tooltipY: item,
              tooltipIndex: index,
            })
          }
        />
        
      </G>
    ));
    

    const Tooltip = ({ x, y, data, index, date, max}) => (
      <G
          x={ x(index) - (200 / 2)}
          key={ 'tooltip' }
          onPress={ () => this.setState({tooltipIndex:null}) }
      >
          
          <G x={ 200 / 2 }>
              <Line
                  y1={ 100 + 40 }
                  y2={ y(data[index]) }
                  stroke={ 'grey' }
                  strokeWidth={ 2 }
              />
              <Circle
                  cy={ y(data[index]) }
                  r={ 6 }
                  stroke={ 'rgb(134, 65, 244)' }
                  strokeWidth={ 2 }
                  fill={ 'white' }
              />
          </G>
          <G  x={ ((200-10)/2)-((index/(max-1))*(200-10)) } y={ 100 }>
              <Rect
                  height={ 40 }
                  width={ 200 }
                  stroke={ 'grey' }
                  fill={ 'white' }
                  ry={ 10 }
                  rx={ 10 }
                  
              />
              <Text
                  x={ 200 / 2 }
                  dy={ 15 }
                  alignmentBaseline={ 'middle' }
                  textAnchor={ 'middle' }
                  fontSize={20}
                  stroke={ 'rgb(134, 65, 244)' }
              >
                  { `${data[index].toFixed(2)}` }
              </Text>
              <Text
                  x={ 200 / 2 }
                  dy={ 33 }
                  alignmentBaseline={ 'middle' }
                  textAnchor={ 'middle' }
                  stroke={ 'rgb(134, 65, 244)' }
              >
                  { `${date}` }
              </Text>
              
          </G>
      </G>
    )

    return (
      <View>
        <View style={{ marginVertical: 25, height: 300, flexDirection: 'row' }}>
  
          <YAxis
            data={this.props.Y_labels}
            contentInset={{top: 10, bottom: 10  }}
            svg={{
              fill: 'grey',
              fontSize: 10,
            }}
            numberOfTicks={10}
            formatLabel={(value) => `${value}`}
          />
  
          <LineChart
            style={{ flex: 1, marginLeft: 10,  }}
            data={data}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={{top: 10, bottom: 10  , left: 20, right: 20}}
          >
  
            <ChartPoints color="#003F5A" />
            {
              
              this.state.tooltipIndex!=null?<Tooltip onPress= {() =>console.log("REEEEE")}   
              index={this.state.tooltipIndex} key={this.state.tooltipIndex} date={this.state.tooltipX} max={data.length}/>:<></>
            }

            <Grid />
  
          </LineChart>
          <XAxis
            style={{ marginHorizontal: -5 }}
            data={[0]}
            formatLabel={(value, index) => index}
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
  
  
  
      </View >
  
    );
  }
}

export default Graph;