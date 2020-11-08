import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../../utils/constant-styles'


import { firestore } from '../../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars
import {setCurrentDevice} from '../../../js/actions'

import {editUser,logoutUser} from '../../../js/actions'

class ProfileEditScreen extends Component {
    
  
    constructor(props) {
        super(props);

        this.state = {
          originalUser:this.props.user,
          editName:this.props.user.name,
          editFarmName:this.props.user.farmName
        };

    }

    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Edit Profile',
        
      };
    };

    componentDidMount() {
    }

    SubmitEdits = async() =>{
      
      var ogUser = this.state.originalUser;
      ogUser.name = this.state.editName==null||this.state.editName==""?"No Name":this.state.editName;
      ogUser.farmName = this.state.editFarmName==null||this.state.editFarmName==""?"No Farm Name":this.state.editFarmName;
      var doc = firestore.collection('users').doc(this.props.user.id);

     

      const res = await doc.update({name:ogUser.name,farmName:ogUser.farmName}).then(() => {

        this.props.logoutUser();
        this.props.editUser(ogUser);
        this.props.navigation.navigate('Profile',{})
      });;


      
      

    }
 

    render(){
      return(
      <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.inputStyle}>Full Name</Text>
            <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({editName:text})} value={this.state.editName}/>
            <Text style={styles.inputStyle}>Farm Name</Text>
            <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({editFarmName:text})} value={this.state.editFarmName}/>
            <Button 
            buttonStyle={styles.clearButton} 
            titleStyle={styles.clearButtonText} 
            title={"Submit Edits"}
            onPress = {
              () => this.SubmitEdits()
            }
            >
            </Button>
          </View>
        </View>
      )
          
    }
}


const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(logoutUser()),
    editUser: (user) => dispatch(editUser(user)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ProfileEditScreen)
