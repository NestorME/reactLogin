import React, { Component } from 'react';
import{AppRegistry,Text,TextInput,View,BackHandler,AsyncStorage} from 'react-native';
import {StackNavigator,NavigationActions} from 'react-navigation';

import Button from '../components/button';
import firebase from '../../firebase';
import styles from '../styles/common-styles.js';

import {GoogleSignin,GoogleSigninButton} from 'react-native-google-signin';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

export default class signup extends Component {
  static navigationOptions = {
    title: 'Signup',
  };
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      email: '',
      password: ''
    };
  }
  componentWillMount() {
    const {dispatch} = this.props.navigation;
    GoogleSignin.hasPlayServices({ autoResolve: true });
    GoogleSignin.configure({
      webClientId: '653349341252-cnaao0cftud6llf9uel2fd5gtl97sr2v.apps.googleusercontent.com' // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
    BackHandler.addEventListener('hardwareBackPress', function() {
      dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Login'
          })
        ]
      }));
      return true;
    });
  }

  render() {
    const {goBack} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.body}>
            <TextInput
                style={styles.textinput}
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
            placeholder={"Email Address"}
            />
          <TextInput
            style={styles.textinput}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
            secureTextEntry={true}
            placeholder={"Password"}
          />
          <Button
            text="Signup"
            onpress={this.signup.bind(this)}
            button_styles={styles.primary_button}
            button_text_styles={styles.primary_button_text} />

            <GoogleSigninButton
              style={{width: 230, height: 48}}
              size={GoogleSigninButton.Size.Icon}
              color={GoogleSigninButton.Color.Dark}
              onPress={this.SignInGmail.bind(this)}/>

          <Button
            text="¿Ya tienes cuenta?"
            onpress={this.goBack.bind(this)}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />

            <OrientationLoadingOverlay
          visible={this.state.loaded}
          color="white"
          indicatorSize="large"
          messageFontSize={24}
          message="Loading..."
          />
        </View>
      </View>
    );
  }
  signup(){

    this.setState({
      loaded: false
    });
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(function(data){
        alert('Your account was created!');
        this.setState({
          loaded: true,
          email: '',
          password: ''
        });
        this.goBack();
    }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  switch(error.code){
    case "EMAIL_TAKEN":
      alert("The new user account cannot be created because the email is already in use.");
    break;

    case "INVALID_EMAIL":
      alert("The specified email is not a valid email.");
    break;

    default:
      alert("Error creating user:"+ error);
  }
  // ...
});

  }
  SignInGmail(){
     const { dispatch } = this.props.navigation;
    this.setState({
      loaded: true
    });
            GoogleSignin.signIn().then((user)=>{
              var token = user.idToken;
              var provider = firebase.auth.GoogleAuthProvider;
              const credential = provider.credential(token);
              firebase.auth().signInWithCredential(credential).then(function(result) {
                  let cuser = firebase.auth().currentUser.uid;
                  firebase.database().ref('users/'+cuser)
                  .once('value', (snapshot)=>{
                       if(snapshot.child("name").val() === null){
                         firebase.database().ref('users/'+cuser).set({
                           name:result.displayName,
                           email:result.email,
                           photoUrl:result.photoURL
                         })
                         dispatch(NavigationActions.reset(
                          {
                             index: 0,
                             actions: [
                               NavigationActions.navigate({ routeName: 'Account'})
                             ]
                           }));
                       }else {
                         alert("Tu ya cuentas con una cuenta has login");
                       }
                  })
                 AsyncStorage.setItem('user_data', result);

              }).catch(function(error) {
                alert("error"+ error);
              });
            }).catch(error=>{
               alert("Play signin services error" + error);
             }).done(()=>{
               this.setState({
                 loaded: false
               });
             });
}
          goBack(){
            const {dispatch} = this.props.navigation;
            dispatch(NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Login'
                })
              ]
            }));
       }
}

AppRegistry.registerComponent('signup', () => signup);
