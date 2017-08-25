/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {AppRegistry,Text,View,AsyncStorage} from 'react-native';
 import {StackNavigator} from 'react-navigation';

 import Login from './src/pages/login';
 import Account from './src/pages/account';
 import Signup from './src/pages/signup';
 import Header from './src/components/header';
 import styles from './src/styles/common-styles.js';
 import Firebase from 'firebase';

export default class clapmapRN extends Component {
  constructor(props){
    super(props);
    this.state = {
      component: null,
      loaded: false
    };
  }

  componentWillMount(){
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      if(user_data != null){
        firebase.auth.signInWithEmailAndPassword(user_data.email, user_data.password).then(function(result){
              this.setState({component: "Account"});
        }).catch(function(error){
             alert(error);
        });
      }else{
        this.setState({component: "Login"});
      }
    });

  }

  render(){
    if(this.state.component == "Login"){
      return (
        <ModalStack
          ref={nav =>{Login}}
        />
      );
    }else if(this.state.component == "Account"){
      return (
        <ModalStack
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
const ModalStack = StackNavigator({
  Login: { screen: Login },
  Account: {screen: Account},
  Signup: {screen: Signup},
});

AppRegistry.registerComponent('clapmapRN', () => clapmapRN);
