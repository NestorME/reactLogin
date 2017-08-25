import * as firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCGMYwc_2vlsl4-zo80rEeHaoRJxSD0tus",
   authDomain: "clapmap-bd38c.firebaseapp.com",
   databaseURL: "https://clapmap-bd38c.firebaseio.com",
   projectId: "clapmap-bd38c",
   storageBucket: "",
   messagingSenderId: "653349341252"
  };
  firebase.initializeApp(config);

  export default firebase;
