import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text, TextInput,Image,Alert} from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';

import styles from './styles'
import { Colors } from '../../utils/constant-styles'

import firebase from '../../../config/firebase';

import { connect } from 'react-redux' // eslint-disable-line no-unused-vars

import {loginUser} from '../../js/actions'

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
          signName:"",
          signEmail:"",
          signConEmail:"",
          signPassword:"",
          signConPassword:"",
    
          //LOGIN
          loginEmail:"",
          loginPassword:""
    
        };
    }

    static navigationOptions = ({ navigation }) => {
      return {
        title: 'DOE App',
        // headerRight: (
        //   <Button
        //     buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
        //     icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
        //     onPress={() => { navigation.push('AddBoard') }}
        //   />
        // ),
      };
    };

    loginScreen = () =>{
      this.setState({screen:"login"});
    }

    signupScreen = () =>{
      this.setState({screen:"signup"});
    }

    login = () =>{

      this.setState({isLoading:true});
      var out =this;


      firebase.auth().signInWithEmailAndPassword(this.state.loginEmail, this.state.loginPassword)
      .then(function(result) {
        
        out.loginUser({id:result.user.uid})

        out.setState({isLoading:false});
        
        out.nextPage();
      }).catch(function(error) {
        // Handle error.
        switch(error.code){
          case "auth/user-disabled": out.setErrorMessage("User is disabled");
          break;
          case "auth/invalid-email": out.setErrorMessage("Email is Invalid.");
          break;
          case "auth/user-not-found":
          case "auth/wrong-password": out.setErrorMessage("Email or Password is Wrong.");
          break;
          default: out.setErrorMessage("Error, try again");
        }

        out.setState({isLoading:false});
      });

    }

    signup = () =>{
      
      this.setState({isLoading:true});
      if(this.state.signName==""||this.state.signEmail==""||this.state.signPassword==""){
        this.setErrorMessage("One or more fields are incomplete");
        this.setState({isLoading:false});
      }else if(this.state.signEmail != this.state.signConEmail){
        this.setErrorMessage("Emails do not match");
        this.setState({isLoading:false});
      }else if(this.state.signPassword != this.state.signConPassword){
        this.setErrorMessage("Passwords do not match");
        this.setState({isLoading:false});
      }
      else {
        this.firebaseCreateUser(this.state.signEmail, this.state.signPassword,this.state.signName)
      }

    }

    firebaseCreateUser = (email,password,name) => {

      var out =this;

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(result) {

        firebase.database().ref('users/' + result.user.uid).set({
          name: name,
          email: email,
        },function(error){
          if(error){
            out.setErrorMessage("Email already in use.")
          }else{

            out.loginUser({id:result.user.uid})
            
            console.log("NEW")
            
            out.nextPage();
          }

        });


        out.setState({isLoading:false});
        
      }).catch(function(error) {
        // Handle error.
        switch(error.code){
          case "auth/email-already-in-use": out.setErrorMessage("Email already in use.");
          break;
          case "auth/invalid-email": out.setErrorMessage("Email is Invalid.");
          break;
          case "auth/weak-password": out.setErrorMessage("Password is too weak.");
          break;
          default: out.setErrorMessage("Error, try again");
        }

        out.setState({isLoading:false});
      });

    }

    loginUser = (user) =>{
      this.props.loginUser(user)
    }
    
    setErrorMessage = (message) =>{
      this.setState({errorMessage:message})
    }

    nextPage = () =>{
      this.setState({isLoading:false})
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
      
                  <Text style={styles.inputStyle}>Full Name</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({signName:text})} value={this.state.signName}/>
                  
                  <Text style={styles.inputStyle}>Email</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({signEmail:text})} value={this.state.signEmail}/>
                  
                  <Text style={styles.inputStyle}>Confirm Email</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({signConEmail:text})} value={this.state.signConEmail}/>

                  <Text style={styles.inputStyle}>Password</Text>
                  <TextInput underlineColorAndroid={Colors.text}  secureTextEntry={true} style={styles.inputStyle} onChangeText={(text) => this.setState({signPassword:text})} value={this.state.signPassword}/>
      
                  <Text style={styles.inputStyle}>Confirm Password</Text>
                  <TextInput underlineColorAndroid={Colors.text}  secureTextEntry={true} style={styles.inputStyle} onChangeText={(text) => this.setState({signConPassword:text})} value={this.state.signConPassword}/>
                  <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
      
                  <Button title="Create Account" buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText} onPress={this.signup}/>
                </ScrollView>
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
                <ScrollView style={styles.subContainer}>
                  <Text style={styles.inputStyle}>Email</Text>
                  <TextInput underlineColorAndroid={Colors.text}  style={styles.inputStyle} onChangeText={(text) => this.setState({loginEmail:text})} value={this.state.loginEmail}/>
                  <Text></Text>
                  <Text style={styles.inputStyle}>Password</Text>
                  <TextInput underlineColorAndroid={Colors.text}  secureTextEntry={true} style={styles.inputStyle} onChangeText={(text) => this.setState({loginPassword:text})} value={this.state.loginPassword}/>
                  <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                
                  <Button title="Login" buttonStyle={styles.clearButton} titleStyle={styles.clearButtonText}onPress={this.login}/>
                </ScrollView>
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

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => {
  return {
    loginUser: (user) => dispatch(loginUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);
