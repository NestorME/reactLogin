import React, { Component } from 'react';
import{AppRegistry,StyleSheet,Text,View,Image,AsyncStorage} from 'react-native';
import {GoogleSignin,GoogleSigninButton} from 'react-native-google-signin';
import {StackNavigator,NavigationActions} from 'react-navigation';

import Button from '../components/button';
import Header from '../components/header';
import Login from './login';
import styles from '../styles/common-styles.js';
import firebase from '../../firebase';


export default class account extends Component {

  constructor(props){

    super(props);
    this.state = {
      loaded: false,
    }

  }

  componentWillMount(){
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      this.setState({
        user: user_data,
        loaded: true
      });
    });

  }

  render(){

    return (
      <View style={styles.container}>
        <View style={styles.body}>
        {
          this.state.user &&
            <View style={styles.body}>
              <View style={page_styles.email_container}>
                <Text style={page_styles.email_text}>{this.state.user.email}</Text>
              </View>
              <Image
                style={styles.image}
                source={{uri: this.state.user.profileImageURL}}
              />
              <Button
                  text="Logout"
                  onpress={this.logout.bind(this)}
                  button_styles={styles.primary_button}
                  button_text_styles={styles.primary_button_text} />
            </View>
        }
        </View>
      </View>
    );
  }

  logout(){
    const {dispatch} = this.props.navigation;
    AsyncStorage.removeItem('user_data');
    GoogleSignin.signOut().then(() => {
      dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Login'
          })
        ]
      }));
      firebase.signOut();
    }).catch((err) => {

    });
  }

}

const page_styles = StyleSheet.create({
  email_container: {
    padding: 20
  },
  email_text: {
    fontSize: 18
  }
});
