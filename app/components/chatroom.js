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
  TextInput
} from 'react-native';

var Firebase = require('firebase');

var ref = new Firebase("https://learnet.firebaseio.com/");

var stripe_url = 'https://api.stripe.com/v1/'
var secret_key = 'sk_test_7OwR2IfSJ3yMbJJKM1XI9p4j '

class Chat extends Component {
  constructor (props) {
      super(props);
      this.state = {
        username: "",
        chat: [],
        id: '',
        text: '',
        input: '',
        teachAcc: '',
        teach: ''
      }
    }

    componentDidMount() {
      var _this = this;
      AsyncStorage.getItem("username").then(function(username){
        _this.setState({username: username})
      }).then(function(){
        ref.child('users/' + _this.state.username+'/chats').once('value', function(snapshot){
          _this.setState({chat: snapshot.val()});
          var id = '';
          for(var i in snapshot.val()){
            id = i;
          }
          _this.setState({id: id});
          ref.child('chats/' + id).once('value', function(snap){
            _this.setState({teachAcc:snap.val().teacher});
            _this.setState({teach:snap.val().teacher});
          }).then(function(){
            ref.child('users/' + _this.state.teachAcc).once('value', function(snap) {
              _this.setState({teachAcc:snap.val().accID});
            })
          })
        })
      }
    ).then(function(){
      ref.child('chats/'+_this.state.id).on('value', function(snap){
        _this.setState({text: snap.val().text})
      })
    });
    }

    sendMsg() {
      var _this = this;
      ref.child('chats/'+this.state.id).once('value', function(snap){
        ref.child('chats/'+_this.state.id+'/text').set(snap.val().text + _this.state.username + " : " + _this.state.input + ' \n ' )
      })
    }

    pay() {
      var _this = this;
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
      }).then(function (response) {
        response.json().then(function(data){
          _this.sendMoney(data.id);
        });
      });
    }

    sendMoney(id) {
      var _this = this;
      var details = {
        "amount": '1000',
        "currency": 'usd',
        "source": id,
        "destination": _this.state.teachAcc
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      return fetch(stripe_url + 'charges', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + secret_key
        },
        body: formBody
      }).then(function (response) {
        response.json().then(function(data){
          console.log(data);
          ref.child('users/' + _this.state.username).once('value', function(snap) {

          })
          ref.child('users/' + _this.state.username + '/charges/' + data.id).set({amount: '$' + (data.amount/100), sentTo : _this.state.teach});
        });
      });
    }

    render() {
      return(
        <View>
        <Text>{this.state.text}</Text>
        <TextInput onChangeText={(input) => this.setState({input})}/>

        <TouchableHighlight onPress={e => {this.sendMsg(e)}}>
          <Text>Send a msg</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={e => {this.pay(e)}}>
          <Text>Pay</Text>
        </TouchableHighlight>

        <TouchableHighlight style={{backgroundColor: 'white'}} onPress={e => {this.goAcad(e)}}>
             <Text style={{fontSize: 27, color: 'black'}}>Go to academy</Text>
        </TouchableHighlight>
        </View>)
    }

    goAcad() {
      this.props.navigator.push({
        id: 'Academy',
        name: 'Academy'
      });
    }
}

export default Chat;
