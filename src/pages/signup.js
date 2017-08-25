import React, { Component } from 'react';
import{
  AppRegistry,
  Text,
  TextInput,
  View
} from 'react-native';

import Button from '../components/button';
import firebase from '../../firebase';
import styles from '../styles/common-styles.js';

export default class signup extends Component {
  static navigationOptions = {
    title: 'Signup',
  };
  constructor(props){
    super(props);

    this.state = {
      loaded: true,
      email: '',
      password: ''
    };
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

          <Button
            text="Got an Account?"
            onpress={()=> goBack()}
            button_styles={styles.transparent_button}
            button_text_styles={styles.transparent_button_text} />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('signup', () => signup);
