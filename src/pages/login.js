import React, {Component} from 'react';
import {AppRegistry,StyleSheet,Text,TextInput,View,AsyncStorage} from 'react-native';
import {StackNavigator,NavigationActions} from 'react-navigation';
import {GoogleSignin,GoogleSigninButton} from 'react-native-google-signin';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

import Button from '../components/button';
import firebase from '../../firebase';
import styles from '../styles/common-styles.js';


export default class login extends Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loaded: false
    }
  }

  componentWillMount() {
    GoogleSignin.hasPlayServices({
      autoResolve: true
    });
    GoogleSignin.configure({
      webClientId: '10437864378-p3cbfjibkv200nei519i0andfe6ikf98.apps.googleusercontent.com' // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }
  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style = {styles.container} >
      <View style = {styles.body} >



      <GoogleSigninButton
      style = {{width: 230,height: 48}}
      size = {GoogleSigninButton.Size.Icon}
      color = {GoogleSigninButton.Color.Blue}
      onPress = {this.loginGmail.bind(this)}/>

      <Button text = "Registrate"
      onpress = {this.signUp.bind(this)}
      button_styles = {styles.transparent_button}
      button_text_styles = {styles.transparent_button_text}/>

      <OrientationLoadingOverlay visible = {this.state.loaded}
      color = "white"
      indicatorSize = "large"
      messageFontSize = {24}
      message = "Loading..." />

      </View>
      </View>
    );
  }

  // loginEmail() {
  //   this.setState({
  //     loaded: false
  //   });
  //   firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(result){
  //     this.setState({
  //       loaded: true
  //     });
  //         AsyncStorage.setItem('user_data', JSON.stringify(result));
  //         this.props.navigator.push({
  //           component: Account
  //         });
  //   }).catch(function(error){
  //         alert('Login Failed. Please try again'+ error);
  //   });
  // }

  loginGmail() {
    const {dispatch} = this.props.navigation;
    this.setState({loaded: true});
    GoogleSignin.signIn().then((user) => {
      var token = user.idToken;
      var provider = firebase.auth.GoogleAuthProvider;
      const credential = provider.credential(token);
      firebase.auth().signInWithCredential(credential).then(function(result) {
          AsyncStorage.setItem('user_data',JSON.stringify(result));
        let cuser = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + cuser)
          .once('value', (snapshot) => {
            if (snapshot.child("name").val() !== null) {
              dispatch(NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'Account'
                  })
                ]
              }));
            } else {
              let log = new login();
              log.logOut();
            }
          })
      }).catch(error => {
        alert("error" + error);
      });
    }).catch(error => {
      alert("Play signin services error" + error)
    }).done(() => {
      this.setState({
        loaded: false
      });
    });
  }

  // loginFacebook() {
  //   this.setState({
  //     loaded: false
  //   });
  //   var provider = new firebase.auth.FacebookAuthProvider();
  //   firebase.auth().signInWithPopup(provider).then(function(result) {
  //     this.setState({
  //       loaded: true
  //     });
  //     alert(JSON.stringify(result));
  //     firebase.database().ref('users').push({
  //       name: result.user.displayName,
  //       email: result.additionalUserInfo.profile.email,
  //       photoUrl: result.user.photoURL
  //     })
  //     AsyncStorage.setItem('user_data', JSON.stringify(result));
  //     this.props.navigation.dispatch('Account');
  //   }).catch(function(error) {
  //     alert("error" + error);
  //     alert('Login Failed. Please try again' + error);
  //   });
  // }
  logOut() {
    alert("¿No tienes una cuenta? registrate!!!");
    GoogleSignin.signOut().then(() => {
      firebase.signOut();
      AsyncStorage.removeItem('user_data');
    }).catch((err) => {

    });
  }
  signUp() {
    const {dispatch} = this.props.navigation;
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Signup'
        })
      ]
    }));
  }
}

AppRegistry.registerComponent('login', () => login);
