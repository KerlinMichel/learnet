import React, {
  Alert,
  AsyncStorage,
  Component,
  StyleSheet,
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

//var Stripe = require('./app/components/Stripe.js');
//import Stripe from './app/components/Stripe.js';

var stripe_url = 'https://api.stripe.com/v1/'
var secret_key = 'sk_test_7OwR2IfSJ3yMbJJKM1XI9p4j '

var Firebase = require('firebase');
var ref = new Firebase("https://learnet.firebaseio.com/");

class Account extends Component {

  constructor (props) {
      super(props);
      this.state = {
        username: ""
      };
  }

  becomeStudent(row) {
    var _this = this;
    var usr =_this.state.username;
    ref.child('users/'+_this.state.username).once('value', function(snapshot){
      ref.child('users/'+_this.state.username+'/isStudent').set(!snapshot.val().isStudent)
    })
  }

  becomeTeacher(row) {
    var _this = this;
    var usr =_this.state.username;
    ref.child('users/'+_this.state.username).once('value', function(snapshot){
      ref.child('users/'+_this.state.username+'/isTeacher').set(!snapshot.val().isTeacher)
    })
  }

  submit(row) {
    //Stripe.createCardToken('4242424242424242', '4', '2019', '123');
    var cardDetails = {
      "card[number]": '4242424242424242',
      "card[exp_month]": '4',
      "card[exp_year]": '2019',
      "card[cvc]": '123'
    };

    var formBody = [];
    for (var property in cardDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(cardDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return fetch(stripe_url + 'tokens', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + secret_key
      },
      body: formBody
    });
  }

  componentDidMount() {
    var _this = this;
    AsyncStorage.getItem("username").then(function(username){
      _this.setState({username: username})
    })
  }

  render() {
    return(
      <View><Text>Account Settings{this.state.username}</Text>
      <TouchableHighlight onPress={e => {this.becomeStudent(e)}}>
            <Text>Become Student</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={e => {this.becomeTeacher(e)}}>
           <Text>Become Teacher</Text>
      </TouchableHighlight>
      <TextInput
        onChangeText={(username) => this.setState({username})}
        placeholder='username'
      />
      <TouchableHighlight onPress={e => {this.submit(e)}}>
           <Text>Create Stripe account to send and recieve payments</Text>
      </TouchableHighlight>
      </View>
    )
  }
}

export default Account;
