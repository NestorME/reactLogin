import React, { Component } from 'react';
import{
  StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 9,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textinput: {
    marginTop: 10,
    height: 48,
    width: 230
  },
  transparent_button: {
    marginTop: 10,
    padding: 15
  },
  transparent_button_text: {
    color: '#0485A9',
    fontSize: 16
  },
  primary_button: {
    width: 230,
    height: 48,
    margin: 10,
    padding: 15,
    backgroundColor: '#529ecc'
  },
  primary_button_text: {
    color: '#FFF',
    fontSize: 18
  },
  image: {
    width: 100,
    height: 100
  }
});
