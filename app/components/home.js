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

var stripe_url = 'https://api.stripe.com/v1/'
var secret_key = 'sk_test_7OwR2IfSJ3yMbJJKM1XI9p4j '

var Firebase = require('firebase');

var ref = new Firebase("https://learnet.firebaseio.com/");

class Home extends Component {
  constructor (props) {
      super(props);
      this.state = {
        username: "",
        password: "",
        lng: "",
        lat: ""
      };
    }

  checkInput = function() {
    return (typeof this.state.username !== "string" ||
        typeof this.state.password !== "string" ||
        this.state.username.length === 0 ||
        this.state.password.length === 0)
  }

  signIn(row) {
    var usr = this.state.username;
    var pass = this.state.password;
    var _this = this;
    ref.child('users').once('value', function(snapshot){
      //ref.child('test').set({test:snapshot.val()[usr]['password']});
      if(snapshot.hasChild(usr)) {
        if(snapshot.val()[usr]['password'] == pass) {
          AsyncStorage.setItem("username", usr)
           .then(function () {
             AsyncStorage.setItem("password", pass);
           })
           .then(function () {
             _this.props.navigator.push({
               id: 'Academy',
               name: 'Academy'
             });
           })
           .done();
        }
      }
    })
  }

  watchID = (null: ?number);

  signUp(row) {

      var this_ref = this;
      new Promise(function(res, rej) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            var lng = position['coords']['longitude'];//['longitude'] JSON.stringify(position)
            this_ref.setState({lng});
            var lat = position['coords']['latitude'];
            this_ref.setState({lat});
            res({lng: this_ref.state.lng, lat:this_ref.state.lat});
          },
          (error) => alert(error),
          //{enableHighAccuracy: true}//timeout: 20000, maximumAge: 1000
        );
        /*this_ref.watchID = navigator.geolocation.watchPosition((position) => {
          var lng = position['coords']['longitude'];
          this_ref.setState({lng});
          var lat = position['coords']['latitude'];
          this_ref.setState({lat});
       });
       navigator.geolocation.clearWatch(this_ref.watchID);*/
     }).then(function(pos){
        ref.child('users/'+this_ref.state.username).set({
          name: this_ref.state.username,
          password: this_ref.state.password,
          lng: pos.lng,
          lat: pos.lat,
          isStudent: false,
          isTeacher: false
        });
      })

      var details = {
        "managed": 'true',
        "country": 'US',
        "legal_entity[type]": 'individual',
        "legal_entity[first_name]": this.state.username,
        "legal_entity[last_name]" : "Doth",
        "legal_entity[address][city]" : "Homestead",
        "legal_entity[dob][day]" : "31",
        "legal_entity[dob][month]" : "12",
        "legal_entity[dob][year]" : "1969",
        "legal_entity[ssn_last_4]" : "1234",
        "tos_acceptance[date]" : "1460213808",
        "tos_acceptance[ip]" : "8.8.8.8"
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      console.log( fetch(stripe_url + 'accounts', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + secret_key
        },
        body: formBody
      })
        .then(function (response) {
          response.json().then(function(data){
            //console.log(data.id);
            ref.child('users/'+this_ref.state.username+'/accID').set(data.id);
          });
        })
    );
  }

  componentDidMount() {
    /*navigator.geolocation.getCurrentPosition(
      (position) => {
        var lng = position['coords']['longitude'];//['longitude'] JSON.stringify(position)
        this.setState({lng});
        var lat = position['coords']['latitude'];
        this.setState({lat});
      },
      (error) => alert(error),
      //{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lng = position['coords']['longitude'];//['longitude'] JSON.stringify(position)
      this.setState({lng});
      var lat = position['coords']['latitude'];
      this.setState({lat});
   }); */
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return(
      <View style={styles.container}>
      <Text style={styles.text}>learnet</Text>
      <TextInput
        style={styles.login}
        onChangeText={(username) => this.setState({username})}
        placeholder='username'
      />
      <TextInput
        style={styles.login}
        onChangeText={(password) => this.setState({password})}
        placeholder='password'
      />
      <TouchableHighlight style={styles.button} onPress={e => {this.signIn(e)}}>
             <Text style={styles.text}>Sign In</Text>
         </TouchableHighlight>
     <TouchableHighlight style={styles.button} onPress={e => {this.signUp(e)}}>
            <Text style={styles.text}>Sign Up</Text>
        </TouchableHighlight>
          <Text style={styles.text}>{this.state.lng}</Text>
        <Text style={styles.text}>{this.state.lat}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f1f42',
    flex: 1,
    flexDirection: 'column'
  },
  login: {
    color: 'white',
    borderColor: 'gray',
    borderWidth:1
  },
  text: {
    color: 'white'
  },
  button: {
    //flex: 1,
    //color: 'white',
    backgroundColor: '#9139e3',
  },
});

export default Home;
