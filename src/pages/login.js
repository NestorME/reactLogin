import React, { Component } from 'react';
import{AppRegistry,StyleSheet,Text,TextInput,View,AsyncStorage} from 'react-native';
import {StackNavigator,NavigationActions} from 'react-navigation';
import {GoogleSignin,GoogleSigninButton} from 'react-native-google-signin';

import Button from '../components/button';
import firebase from '../../firebase';
import styles from '../styles/common-styles.js';
import Account from './account';


export default class login extends Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props){
    super(props);

    this.state = {
      email: '',
      password: '',
      loaded: true
    }
  }

 componentWillMount() {
   GoogleSignin.hasPlayServices({ autoResolve: true });
   GoogleSignin.configure({
     webClientId: '653349341252-cnaao0cftud6llf9uel2fd5gtl97sr2v.apps.googleusercontent.com' // client ID of type WEB for your server (needed to verify user ID and offline access)
   });
 }
  render(){
     const {navigate} = this.props.navigation;

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
            text="Login"
            onpress={this.loginEmail.bind(this)}
            button_styles={styles.primary_button}
            button_text_styles={styles.primary_button_text} />
            <Button
              text="Login con facebook"
              onpress={this.loginFacebook.bind(this)}
              button_styles={styles.primary_button}
              button_text_styles={styles.primary_button_text} />
            <GoogleSigninButton
            text="Login"
              style={{width: 230, height: 48}}
              size={GoogleSigninButton.Size.Icon}
              color={GoogleSigninButton.Color.Dark}
              onPress={this.loginGmail.bind(this)}/>

          <Button
            text="New here?"
            onpress={() => navigate('Signup')}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />
        </View>
      </View>
    );
  }

  loginEmail(){
    this.setState({
      loaded: false
    });
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(result){
      this.setState({
        loaded: true
      });
          AsyncStorage.setItem('user_data', JSON.stringify(result));
          this.props.navigator.push({
            component: Account
          });
    }).catch(function(error){
          alert('Login Failed. Please try again'+ error);
    });
  }

  loginGmail(){
     const { dispatch } = this.props.navigation;
    this.setState({
      loaded: true
    });
            GoogleSignin.signIn().then((user)=>{
              var token = user.idToken;
              var provider = firebase.auth.GoogleAuthProvider;
              const credential = provider.credential(token);
              firebase.auth().signInWithCredential(credential).then(function(result) {
                  firebase.database().ref('users').push({
                    name:result.displayName,
                    email:result.email,
                    photoUrl:result.photoURL
                  })
                  // AsyncStorage.setItem('user_data', JSON.stringify(result));
                dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Account'})
                    ]
                  }));

              }).catch(function(error) {
                alert("error"+ error);
              });
            }).catch(error=>{
               alert("Play signin services error" + error)
             }).done();
}

  loginFacebook(){
    this.setState({
      loaded: false
    });
    var provider = new firebase.auth.FacebookAuthProvider();
   firebase.auth().signInWithPopup(provider).then(function(result) {
     this.setState({
       loaded: true
     });
     alert(JSON.stringify(result));
     firebase.database().ref('users').push({
       name:result.user.displayName,
       email:result.additionalUserInfo.profile.email,
       photoUrl:result.user.photoURL
     })
     AsyncStorage.setItem('user_data', JSON.stringify(result));
     this.props.navigation.dispatch('Account');
   }).catch(function(error) {
alert("error"+ error);
  alert('Login Failed. Please try again'+ error);
});

  }

}


AppRegistry.registerComponent('login', () => login);
