import * as firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBHCrPERKkydgmyzhePX05kzPgmze522bc",
    authDomain: "reactlogin-14fd8.firebaseapp.com",
    databaseURL: "https://reactlogin-14fd8.firebaseio.com",
    projectId: "reactlogin-14fd8",
    storageBucket: "reactlogin-14fd8.appspot.com",
    messagingSenderId: "10437864378"
  };
  firebase.initializeApp(config);

  export default firebase;
