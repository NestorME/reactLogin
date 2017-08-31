/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {AppRegistry,Text,View,AsyncStorage} from 'react-native';
 import {GoogleSignin,GoogleSigninButton} from 'react-native-google-signin';
 import {StackNavigator} from 'react-navigation';

 import Login from './src/pages/login';
 import Account from './src/pages/account';
 import Signup from './src/pages/signup';
 import Header from './src/components/header';
 import styles from './src/styles/common-styles.js';
 import firebase from 'firebase';

export default class reactLogin extends Component {
  constructor(props){
    super(props);
    this.state = {
      component: null,
      loaded: true
    };
  }

  componentWillMount(){
    GoogleSignin.hasPlayServices({
      autoResolve: true
    });
    GoogleSignin.configure({
      webClientId: '10437864378-p3cbfjibkv200nei519i0andfe6ikf98.apps.googleusercontent.com' // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      if(user_data != null){
        GoogleSignin.signIn().then((user) => {
          var token = user.idToken;
          var provider = firebase.auth.GoogleAuthProvider;
          const credential = provider.credential(token);
          firebase.auth().signInWithCredential(credential).then(function(result) {

          }).catch(error => {
            alert("error" + error);
          });
        }).catch(error => {
          alert("Play signin services error" + error)
        }).done(() => {
          this.setState({component: "Account"});
        });
      }else{
        this.setState({component: "Login"});
      }
    });

  }

  render(){
    if(this.state.component == "Login"){
      return (
        <ModalStackL
          ref={nav =>{Login}}
        />
      );
    }else if(this.state.component == "Account"){
      return (
        <ModalStackA
          ref={nav =>{Account}}
        />
      );
    }else{
      return (
        <View style={styles.container}>
          <Header text="React Native Firebase Auth" loaded={this.state.loaded} />
          <View style={styles.body}></View>
        </View>
      );
    }

  }

}
const ModalStackA = StackNavigator({
  Account: {screen: Account},
  Login: { screen: Login },
});
const ModalStackL = StackNavigator({
  Login: { screen: Login },
  Account: {screen: Account},
  Signup: {screen: Signup},
});

AppRegistry.registerComponent('reactLogin', () => reactLogin);
