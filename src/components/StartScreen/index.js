import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

class StartScreen extends Component {

    static navigationOptions = ({ navigation }) => {
      return {
        title: 'Start',
      };
    };
    constructor() {
        super();
        this.state = {
          isLoading: false,
          screen: "none",
          errorMessage: "",
    
          //Sign Up
          signFirstName:"",
          signLastName:"",
          signPassword:"",
          signConPassword:"",
    
          //LOGIN
          loginEmail:"",
          loginPassword:""
    
        };
    }

    loginScreen = () =>{
      this.setState({screen:"login"});
    }

    signupScreen = () =>{
      this.setState({screen:"signup"});
    }

    login = () =>{
      this.nextPage();
    }

    signup = () =>{
      this.nextPage();
      
    }

    nextPage = () =>{
      
      this.props.navigation.navigate('Menu',{});
    }

    render(){
        if(this.state.isLoading){
            return(
              <View style={styles.activity}>
                <ActivityIndicator size="large" color="#ffffff"/>
              </View>
              
          
            )
          }
          else if(this.state.screen=="signup"){
            return(
              <View style={styles.container}>
      
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Sign Up</Text>
                </View>
                <ScrollView style={styles.subContainer}>
      
                  <Text style={styles.inputStyle}>FirstName</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({signFirstName:text})} value={this.state.signFirstName}/>
      
                  <Text style={styles.inputStyle}>LastName</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({signLastName:text})} value={this.state.signLastName}/>
      
                  <Text style={styles.inputStyle}>Password</Text>
                  <TextInput underlineColorAndroid={Colors.text}  secureTextEntry={true} style={styles.inputStyle} onChangeText={(text) => this.setState({signPassword:text})} value={this.state.signPassword}/>
      
                  <Text style={styles.inputStyle}>Confirm Password</Text>
                  <TextInput underlineColorAndroid={Colors.text}  secureTextEntry={true} style={styles.inputStyle} onChangeText={(text) => this.setState({signConPassword:text})} value={this.state.signConPassword}/>
                  <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
      
                </ScrollView>
                <Button title="Create Account" buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText} onPress={this.signup}/>
                <Text style={styles.clickableText} onPress={this.loginScreen}>I already have an account</Text>
              </View>
            )
          }
      
          else if(this.state.screen=="login"){
            return(
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Login</Text>
                </View>
                <View style={styles.subContainer}>
                  <Text style={styles.inputStyle}>Email</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({loginEmail:text})} value={this.state.loginEmail}/>
                  <Text></Text>
                  <Text style={styles.inputStyle}>Password</Text>
                  <TextInput underlineColorAndroid={Colors.text}  secureTextEntry={true} style={styles.inputStyle} onChangeText={(text) => this.setState({loginPassword:text})} value={this.state.loginPassword}/>
                  <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                </View>
                <Button title="Login" buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText}onPress={this.login}/>
                <Text style={styles.clickableText} onPress={this.signupScreen}>I don't have an account</Text>
              </View>
            )
          }
          
          else{
            return (
              <View style={styles.container}>
                  <View style={styles.container} >
                  
                    {/* <Image style={{width: "100%"}} resizeMode="center" source={require('./assets/Logo.png')}/> */}
                  </View>
                  <View style={styles.container}>
                  
                      <Button title="Login" buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText} onPress={this.loginScreen}/>
      
                      <Button title="Sign Up" buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText} onPress={this.signupScreen}/>
                  </View>
              </View>
            ); 
          }
    }
}


export default StartScreen;
